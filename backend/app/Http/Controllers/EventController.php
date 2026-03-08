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
                ->select('id', 'name', 'start_time', 'end_time', 'location', 'slug');
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
            // select event with categories and seats
            $event = Event::with([
                'ticketCategories:id,event_id,name,base_price,quota',
                'categories:id,name',
            ])->select('id', 'name', 'description', 'is_active', 'start_time', 'end_time', 'location', 'slug')
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
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'required|date|after:now',
                'end_time' => 'required|date|after:start_time',
                'location' => 'required|string|max:255',
                'max_row_index' => 'required|integer|min:0',
                'max_column_index' => 'required|integer|min:0',
                'ticket_categories' => 'required|array|min:1',
                'ticket_categories.*.name' => 'required|string|max:255',
                'ticket_categories.*.base_price' => 'required|numeric|min:0',
                'ticket_categories.*.quota' => 'required|integer|min:1',
                'event_categories' => 'nullable|array',
                'event_categories.*.name' => 'required|string|max:255',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            DB::beginTransaction();
            $event = Event::create(array_merge([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'max_row_index' => $validated['max_row_index'],
                'max_column_index' => $validated['max_column_index'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'location' => $validated['location'],
            ]));
            // creating categories
            $event_category_ids = [];
            if (isset($validated['event_categories'])) {
                foreach ($validated['event_categories'] as $category) {
                    $event_category = EventCategory::firstOrCreate(['name' => $category['name']]);
                    $event_category_ids[] = $event_category->id;
                }
                $event->categories()->sync($event_category_ids);
            }
            $ticket_categories = [];
            foreach ($validated['ticket_categories'] as $category) {
                $ticket_categories[] = new EventTicketCategory([
                    'event_id' => $event->id,
                    'name' => $category['name'],
                    'base_price' => $category['base_price'],
                    'quota' => $category['quota'],
                ]);
            }
            // if quota exceed the dot product of max_row_index and max_column_index, return error
            $total_quota = array_sum(array_column($validated['ticket_categories'], 'quota'));
            $max_capacity = ($validated['max_row_index'] + 1) * ($validated['max_column_index'] + 1);
            if ($total_quota > $max_capacity) {
                DB::rollBack();
                return $this->sendError('Validation Error', ['ticket_categories' => 'Total quota exceed the maximum capacity of the event'], 422);
            }
            $saved_ticket_categories = $event->ticketCategories()->saveMany($ticket_categories);
            DB::commit();
            return $this->sendResponse([
                'event' => $event,
                'ticket_categories' => $saved_ticket_categories,
                'event_categories' => $event->categories()->get(),
            ], 'Event created successfully', 201);
        } catch (\Exception $e) {
            return $this->sendError('Error creating event', ['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'is_active' => 'sometimes|required|boolean',
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
            $seats = EventSeat::with(['ticketCategory:id,name,base_price'])
                ->whereHas('ticketCategory', function ($query) use ($event_id) {
                    $query->where('event_id', $event_id);
                })
                ->select('id', 'ticket_category_id', 'seat_number', 'row_index', 'column_index', 'is_available', 'locked_until')
                ->get();
            return $this->sendResponse($seats, 'Seats retrieved successfully');
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
}
