<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventSeat;
use App\Models\EventTicketCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    // TODO : implement caching for this endpoint
    public function all(Request $request)
    {
        try {
            $validator = Validator::make($request->query(), [
                'limit' => 'sometimes|integer|min:1',
                'page' => 'sometimes|integer|min:1',
                'search' => 'nullable|string|max:255',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            $events = null;
            $limit = $validated['limit'] ?? 10;
            $page = $validated['page'] ?? 1;
            $search = $validated['search'];

            $query = Event::with(['ticketCategories:id,event_id,name,base_price,quota'])
                ->select('id', 'name', 'start_time', 'end_time', 'location', 'slug', 'is_active', 'cover_image_url')
                ->where('is_active', true);
            if ($search) {
                $query->where('name', 'ILIKE', "%$search%");
            }
            $events = $query->paginate($limit, ['*'], 'page', $page);
            return $this->sendResponse($events, 'Events retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Error retrieving events', ['error' => $e->getMessage()], 500);
        }
    }
    public function show($slug)
    {
        try {
            $event = Event::with([
                'ticketCategories.seats:id,ticket_category_id,is_available,locked_until,seat_number',
                'categories:id,name',
            ])
                ->with([
                    'ticketCategories' => function ($query) {
                        $query->withCount([
                            'seats as available_tickets_count' => function ($q) {
                                $q->where('is_available', true)
                                    ->where(function ($lockQuery) {
                                        $lockQuery->whereNull('locked_until')
                                            ->orWhere('locked_until', '<', now());
                                    });
                            }
                        ]);
                    }
                ])
                ->select('id', 'name', 'description', 'is_active', 'start_time', 'end_time', 'location', 'slug', 'cover_image_url', 'terms_and_conditions')
                ->where('slug', $slug)
                ->first();
            if (!$event) {
                return $this->sendError('Event not found', [], 404);
            }
            return $this->sendResponse($event, 'Event retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Error retrieving event', ['error' => $e->getMessage()], 500);
        }
    }
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'terms_and_conditions' => 'nullable|string',
                'start_time' => 'required|date|after:now',
                'end_time' => 'required|date|after:start_time',
                'location' => 'required|string|max:255',
                'max_row_index' => 'required|integer|min:0',
                'max_column_index' => 'required|integer|min:0',
                'ticket_categories' => 'required|array|min:1',
                'ticket_categories.*.name' => 'required|string|max:255',
                'ticket_categories.*.base_price' => 'required|numeric|min:0',
                'ticket_categories.*.quota' => 'required|integer|min:1',
                'ticket_categories.*.seats' => 'required|array|min:1',
                'ticket_categories.*.seats.*.row' => 'required|integer|min:0',
                'ticket_categories.*.seats.*.column' => 'required|integer|min:0',
                'ticket_categories.*.seats.*.number' => 'required|string|max:10',
                'event_categories' => 'nullable|array',
                'event_categories.*.name' => 'required|string|max:255',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $event = Event::create($request->only([
                'name',
                'description',
                'max_row_index',
                'max_column_index',
                'start_time',
                'end_time',
                'location',
                'terms_and_conditions'
            ]));
            if ($request->has('event_categories')) {
                $names = collect($request->event_categories)->pluck('name')->unique();
                foreach ($names as $name) {
                    EventCategory::firstOrCreate(['name' => $name]);
                }
                $categoryIds = EventCategory::whereIn('name', $names)->pluck('id');
                $event->categories()->sync($categoryIds);
            }
            $allSeatsToInsert = [];
            $totalSeatsInPayload = 0;
            foreach ($request->ticket_categories as $catData) {
                $category = $event->ticketCategories()->create([
                    'name' => $catData['name'],
                    'base_price' => $catData['base_price'],
                    'quota' => $catData['quota'],
                ]);
                foreach ($catData['seats'] as $seat) {
                    $allSeatsToInsert[] = [
                        'ticket_category_id' => $category->id,
                        'row_index' => $seat['row'],
                        'column_index' => $seat['column'],
                        'seat_number' => $seat['number'],
                        'is_available' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $totalSeatsInPayload++;
                }
            }
            if (!empty($allSeatsToInsert)) {
                EventSeat::insert($allSeatsToInsert);
            }
            $maxCapacity = ($event->max_row_index + 1) * ($event->max_column_index + 1);
            if ($totalSeatsInPayload > $maxCapacity) {
                throw new \Exception("Total seats exceed grid capacity.");
            }
            DB::commit();
            return $this->sendResponse($event->load('ticketCategories.seats'), 'Event created.', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to create event', ['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|string',
                'is_active' => 'sometimes|required|boolean',
                'cover_image_url' => 'sometimes|url|max:255',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            $event = Event::find($id);
            if (!$event) {
                return $this->sendError('Event not found', [], 404);
            }
            $event->update($validated);
            return $this->sendResponse($event, 'Event updated successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to update event', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function destroy($id)
    {
        try {
            $event = Event::find($id);
            if (!$event) {
                return $this->sendError('event not found', [], 404);
            }
            $event->delete();
            return $this->sendResponse($event, 'Event deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete event', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getCategory($event_id)
    {
        try {
            $categories = EventTicketCategory::where('event_id', $event_id)->get();
            return $this->sendResponse($categories, 'Categories retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve categories', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function updateCategory(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'base_price' => 'sometimes|required|numeric|min:0',
                'quota' => 'sometimes|required|integer|min:1',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            $category = EventTicketCategory::find($id);
            if (!$category) {
                return $this->sendError('Category not found', [], 404);
            }
            $category->update($validated);
            return $this->sendResponse($category, 'Category updated successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to update category', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function destroyCategory($id)
    {
        try {
            $category = EventTicketCategory::find($id);
            if (!$category) {
                return $this->sendError('Category not found', [], 404);
            }
            $category->delete();
            return $this->sendResponse($category, 'Category deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete category', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    // TODO : implement caching for this endpoint
    public function getSeats($event_id)
    {
        try {
            $event = Event::find($event_id);
            $seats = DB::table('event_seats as e')
                ->join('event_ticket_categories as tc', 'e.ticket_category_id', '=', 'tc.id')
                ->where('tc.event_id', $event_id)
                ->select('e.id', 'e.row_index', 'e.column_index', 'e.seat_number', 'e.is_available', 'e.locked_until', 'tc.name as category_name', 'tc.base_price')
                ->get();
            return $this->sendResponse([
                'max_row_index' => $event->max_row_index,
                'max_column_index' => $event->max_column_index,
                'seats' => $seats,
            ], 'Seats retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve seats', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function storeSeats(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'event_id' => 'required|integer|exists:events,id',
                'assignments' => 'required|array|min:1',
                'assignments.*.ticket_category_id' => 'required|integer|exists:event_ticket_categories,id',
                'assignments.*.seats' => 'required|array|min:1',
                'assignments.*.seats.*.row' => 'required|integer|min:0',
                'assignments.*.seats.*.column' => 'required|integer|min:0',
                'assignments.*.seats.*.number' => 'required|string|max:4',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            $data = [];
            $event = Event::find($validated['event_id']);
            $now = now();
            foreach ($validated['assignments'] as $group) {
                foreach ($group['seats'] as $seat) {
                    if ($seat['row'] > $event->max_row_index || $seat['column'] > $event->max_column_index) {
                        return $this->sendError('Validation Error', [
                            'assignments' => "Seat row and column index must be within the event's max_row_index and max_column_index",
                        ], 422);
                    }
                    $data[] = [
                        'ticket_category_id' => $group['ticket_category_id'],
                        'row_index' => $seat['row'],
                        'column_index' => $seat['column'],
                        'seat_number' => $seat['number'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
            EventSeat::insert($data);
            return $this->sendResponse($data, 'Seats assigned successfully', 201);
        } catch (\Exception $e) {
            return $this->sendError('Failed to assign seats', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function destroySeat($id)
    {
        try {
            $seat = EventSeat::withTrashed()->find($id);
            if (!$seat) {
                return $this->sendError('Seat not found', [], 404);
            }
            if (!$seat->orderItem()->exists()) {
                $seat->forceDelete();
                return $this->sendResponse(null, 'Seat deleted permanently');
            }
            $seat->delete();
            return $this->sendResponse($seat, 'Seat deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete seat', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getAttendees()
    {
        $attendees = Attendee::all();
        return $this->sendResponse($attendees, 'Attendees retrieved successfully');
    }
    public function adminGetEvents(Request $request)
    {
        try {
            $validater = Validator::make($request->query(), [
                'search' => 'nullable|string|max:255',
                'limit' => 'sometimes|integer|min:1',
                'page' => 'sometimes|integer|min:1',
            ]);
            if ($validater->fails()) {
                return $this->sendError('Validation Error', $validater->errors(), 422);
            }
            $validated = $validater->validated();
            $limit = $validated['limit'] ?? 10;
            $page = $validated['page'] ?? 1;
            $search = $validated['search'];
            $events = null;

            $query = Event::with(['ticketCategories:event_id,quota'])
                ->select('id', 'name', 'start_time', 'slug', 'is_active')
                ->orderBy('created_at', 'desc');
            if ($search) {
                $query->where('name', 'ILIKE', "%$search%");
            }
            $events = $query->paginate($limit, ['*'], 'page', $page);
            return $this->sendResponse($events, 'Events retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Error retrieving events', ['error' => $e->getMessage()], 500);
        }
    }
}
