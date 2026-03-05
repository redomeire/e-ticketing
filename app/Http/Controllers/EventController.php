<?php

namespace App\Http\Controllers;

use App\Models\Event;
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
            // get is_active from query parameters
            $is_active = $request->query('is_active');
            // is_active is optional, if not provided, return all events
            $events = null;
            if ($is_active) {
                $events = Event::where('is_active', true)->get();
            } else {
                $events = Event::all();
            }
            return $this->sendResponse($events, 'Events retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError('Error retrieving events', ['error' => $e->getMessage()], 500);
        }
    }
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'categories' => 'required|array|min:1',
                'categories.*.name' => 'required|string|max:255',
                'categories.*.base_price' => 'required|numeric|min:0',
                'categories.*.quota' => 'required|integer|min:1',
            ]);
            if ($validator->fails()) {
                return $this->sendError('Validation Error', $validator->errors(), 422);
            }
            $validated = $validator->validated();
            DB::beginTransaction();
            $event = Event::create(array_merge([
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]));
            foreach ($validated['categories'] as $category) {
                EventTicketCategory::create([
                    'event_id' => $event->id,
                    'name' => $category['name'],
                    'base_price' => $category['base_price'],
                    'quota' => $category['quota'],
                ]);
            }
            DB::commit();
            return $this->sendResponse($event, 'Event created successfully', 201);
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
            $seats = EventSeat::with(['category:id,name,base_price'])
                ->whereHas('category', function ($query) use ($event_id) {
                    $query->where('event_id', $event_id);
                })
                ->select('id', 'category_id', 'seat_number', 'row_index', 'column_index', 'is_available', 'locked_until')
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
        /**
         * Payload example:
         * {
         *  event_id: 1,
         *  assignments: [
         *     { category_id: 1, seats: [{ row: 0, column: 0, number: 'A1' }] }
         *   ]
         * }
         */
        try {
            $validator = Validator::make($request->all(), [
                'event_id' => 'required|integer|exists:events,id',
                'assignments' => 'required|array|min:1',
                'assignments.*.category_id' => 'required|integer|exists:event_ticket_categories,id',
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
            foreach ($validated['assignments'] as $group) {
                foreach ($group['seats'] as $seat) {
                    $data[] = [
                        'category_id' => $group['category_id'],
                        'row_index' => $seat['row'],
                        'column_index' => $seat['column'],
                        'seat_number' => $seat['number'],
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
}
