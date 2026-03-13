<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\EventSeat;
use App\Models\EventTicketCategory;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    protected ImageUploadService $image_upload_service;
    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->image_upload_service = $imageUploadService;
    }
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
                ->select('id', 'name', 'description', 'is_active', 'start_time', 'end_time', 'location', 'slug', 'cover_image_url', 'terms_and_conditions', 'max_row', 'max_column')
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
            $ticketCategories = json_decode($request->ticket_categories, true);
            $eventCategories = json_decode($request->event_categories, true);
            $request->merge([
                'ticket_categories' => $ticketCategories,
                'event_categories' => $eventCategories,
            ]);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'terms_and_conditions' => 'nullable|string',
                'cover_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'start_time' => 'required|date|after:now',
                'end_time' => 'required|date|after:start_time',
                'location' => 'required|string|max:255',
                'max_row' => 'required|integer|min:1',
                'max_column' => 'required|integer|min:1',
                'ticket_categories' => 'required|array|min:1',
                'ticket_categories.*.name' => 'required|string|max:255',
                'ticket_categories.*.base_price' => 'required|numeric|min:0',
                'ticket_categories.*.quota' => 'required|integer|min:1',
                'ticket_categories.*.seats' => 'required|array|min:1',
                'ticket_categories.*.seats.*.row' => 'required|integer|min:1',
                'ticket_categories.*.seats.*.column' => 'required|integer|min:1',
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
                'max_row',
                'max_column',
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

            if ($request->hasFile('cover_image')) {
                $image = $request->file('cover_image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $uploaded_file = $this->image_upload_service->uploadFile(
                    $image,
                    $imageName,
                    'event_covers'
                );
                if ($uploaded_file->error) {
                    throw new \Exception('Image upload failed: ' . $uploaded_file->error->message);
                }
                $imageUrl = $uploaded_file->result->url;
                $event->cover_image_url = $imageUrl;
                $event->save();
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
                        'row_index' => (int) $seat['row'] - 1,
                        'column_index' => (int) $seat['column'] - 1,
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
            $maxCapacity = $event->max_row * $event->max_column;
            if ($totalSeatsInPayload > $maxCapacity) {
                throw new \Exception("Total seats exceed grid capacity.");
            }

            DB::commit();

            return $this->sendResponse(
                $event->load('ticketCategories.seats'),
                'Event created successfully.',
                201
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to create event', ['error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|string',
            'is_active' => 'sometimes|required|boolean',
            'terms_and_conditions' => 'sometimes|string',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'location' => 'sometimes|required|string|max:255',
            'event_categories' => 'sometimes|array',
            'event_categories.*.name' => 'required_with:event_categories|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $event = Event::find($id);
        if (!$event)
            return $this->sendError('Event not found', [], 404);

        DB::beginTransaction();
        try {
            $event->update($request->only([
                'name',
                'description',
                'start_time',
                'end_time',
                'location',
                'terms_and_conditions',
                'is_active'
            ]));
            if ($request->has('event_categories')) {
                $categoryIds = [];
                $names = collect($request->event_categories)->pluck('name')->unique()->filter();

                foreach ($names as $name) {
                    $cat = EventCategory::firstOrCreate(['name' => $name]);
                    $categoryIds[] = (int) $cat->id;
                }
                $event->categories()->sync($categoryIds);
            }

            DB::commit();

            return $this->sendResponse($event->load('categories'), 'Event metadata updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Update Failed', ['error' => $e->getMessage()], 500);
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
    public function updateTicketCategory(Request $request, $id)
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
    public function getSeats($slug)
    {
        try {
            $event = Event::where('slug', $slug)->first();
            if (!$event)
                return $this->sendError('Event not found', [], 404);
            $seats = DB::table('event_seats as e')
                ->join('event_ticket_categories as tc', 'e.ticket_category_id', '=', 'tc.id')
                ->where('tc.event_id', $event->id)
                ->where('e.deleted_at', null)
                ->select(
                    'e.id',
                    'e.row_index',
                    'e.column_index',
                    'e.seat_number',
                    'e.is_available',
                    'e.locked_until',
                    'tc.name as category_name',
                    'tc.base_price'
                )
                ->orderBy('e.row_index')
                ->orderBy('e.column_index')
                ->get();

            return $this->sendResponse([
                'max_row' => (int) $event->max_row,
                'max_column' => (int) $event->max_column,
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
                    if ($seat['row'] > $event->max_row || $seat['column'] > $event->max_column) {
                        return $this->sendError('Validation Error', [
                            'assignments' => "Seat row and column index must be within the event's max_row and max_column",
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

    public function updateSeats(Request $request, $slug)
    {
        $validator = Validator::make($request->all(), [
            'max_row' => 'required|integer|min:1',
            'max_column' => 'required|integer|min:1',
            'ticket_categories' => 'required|array|min:1',
            'ticket_categories.*.name' => 'required|string',
            'ticket_categories.*.base_price' => 'required|numeric',
            'ticket_categories.*.quota' => 'required|integer',
            'ticket_categories.*.seats' => 'required|array',
            'ticket_categories.*.seats.*.row' => 'required|integer',
            'ticket_categories.*.seats.*.column' => 'required|integer',
            'ticket_categories.*.seats.*.number' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error("Validation Error: ", $validator->errors()->toArray());
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $event = Event::where('slug', $slug)->first();
        if (!$event)
            return $this->sendError('Event not found', [], 404);

        DB::beginTransaction();
        try {
            $event->update([
                'max_row' => (int) $request->max_row,
                'max_column' => (int) $request->max_column
            ]);

            $activeCategoryIds = [];
            $activeSeatIds = [];

            $oldCategoryIds = $event->ticketCategories()->pluck('id')->toArray();
            Log::info("Old Category IDs in DB: " . implode(',', $oldCategoryIds));

            $existingSeats = EventSeat::whereIn('ticket_category_id', $oldCategoryIds)
                ->get()
                ->keyBy(fn($s) => $s->row_index . '-' . $s->column_index);

            foreach ($request->ticket_categories as $catData) {
                $validSeatsInPayload = collect($catData['seats'])->filter(function ($s) use ($event) {
                    return ((int) $s['row'] - 1) < $event->max_row && ((int) $s['column'] - 1) < $event->max_column;
                });
                $calculatedQuota = $validSeatsInPayload->count();
                $category = $event->ticketCategories()->updateOrCreate(
                    ['name' => $catData['name']],
                    ['base_price' => $catData['base_price'], 'quota' => $calculatedQuota]
                );
                $activeCategoryIds[] = $category->id;

                foreach ($catData['seats'] as $seat) {
                    $rIdx = (int) $seat['row'] - 1;
                    $cIdx = (int) $seat['column'] - 1;
                    $coordKey = $rIdx . '-' . $cIdx;

                    if ($rIdx >= $event->max_row || $cIdx >= $event->max_column) {
                        Log::debug("Seat skipped (Out of Bounds): {$coordKey}");
                        continue;
                    }

                    $existingSeat = $existingSeats->get($coordKey);

                    if ($existingSeat) {

                        if (!$existingSeat->orderItem()->exists()) {
                            DB::table('event_seats')
                                ->where('ticket_category_id', $category->id)
                                ->where('row_index', $rIdx)
                                ->where('column_index', $cIdx)
                                ->where('id', '!=', $existingSeat->id)
                                ->delete();

                            $existingSeat->update([
                                'ticket_category_id' => $category->id,
                                'seat_number' => $seat['number'],
                            ]);
                        }
                        $activeSeatIds[] = $existingSeat->id;
                    } else {
                        DB::table('event_seats')
                            ->whereIn('ticket_category_id', $oldCategoryIds)
                            ->where('row_index', $rIdx)
                            ->where('column_index', $cIdx)
                            ->delete();

                        $newSeat = EventSeat::create([
                            'ticket_category_id' => $category->id,
                            'row_index' => $rIdx,
                            'column_index' => $cIdx,
                            'seat_number' => $seat['number'],
                            'is_available' => true
                        ]);
                        $activeSeatIds[] = $newSeat->id;
                    }
                }
            }

            $cleanupQuery = EventSeat::whereIn('ticket_category_id', $oldCategoryIds)
                ->where(function ($query) use ($activeSeatIds, $event) {
                    $query->whereNotIn('id', $activeSeatIds)
                        ->orWhere('row_index', '>=', $event->max_row)
                        ->orWhere('column_index', '>=', $event->max_column);
                });

            $seatsToDelete = $cleanupQuery->get();

            foreach ($seatsToDelete as $s) {
                if (!$s->orderItem()->exists()) {
                    Log::info("DELETING seat ID: {$s->id} at coord: {$s->row_index}-{$s->column_index}");
                    $s->delete();
                } else {
                    Log::warning("CANNOT DELETE seat ID: {$s->id} - Already ordered.");
                }
            }

            $event->ticketCategories()->whereNotIn('id', $activeCategoryIds)->delete();

            DB::commit();
            Log::info("TRANSACTION COMMITTED SUCCESSFULLY.");

            return $this->sendResponse(null, 'Layout updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("TRANSACTION ROLLED BACK. Error: " . $e->getMessage());
            Log::error("Trace: " . $e->getTraceAsString());
            return $this->sendError('Update Failed', ['error' => $e->getMessage()], 500);
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
        Log::info('AdminGetEvents called with query: ' . json_encode($request->query()));
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
    public function adminStoreEventCategory(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'name' => 'required|string',
                ]
            );
            if ($validator->fails()) {
                return $this->sendError('Failed to create event category', [], 402);
            }
            $validated = $validator->validated();
            $event_category = EventCategory::create($validated);
            return $this->sendResponse($event_category, 'Success creating event category', 201);
        } catch (\Exception $e) {
            return $this->sendError('Error creating event category', ['error' => $e->getMessage()], 500);
        }
    }
    public function getEventCategories(Request $request)
    {
        try {
            $validator = Validator::make($request->query(), [
                'search' => 'nullable|string|max:255',
                'limit' => 'sometimes|integer|min:1',
                'page' => 'sometimes|integer|min:1',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            $query = EventCategory::select('id', 'name');
            if ($validated['search'] ?? null) {
                $query->where('name', 'ILIKE', '%' . $validated['search'] . '%');
            }
            $categories = $query->paginate($validated['limit'] ?? 10, ['*'], 'page', $validated['page'] ?? 1);
            return $this->sendResponse($categories, 'Event categories retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve event categories', [
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
