<?php

namespace App\Observers;

use App\Models\EventSeat;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        $request = request();
        $attendees = $request->input('attendees');

        if (!empty($attendees)) {
            $first_seat_id = $attendees[0]['seat_id'];

            $seat = EventSeat::with('ticketCategory.event')->find($first_seat_id);

            if ($seat && $seat->ticketCategory && $seat->ticketCategory->event) {
                $event = $seat->ticketCategory->event;

                if (!$event->is_active) {
                    Log::warning("Attempt to create order on inactive event: Event ID {$event->id}");

                    throw new \Exception("Sorry, registration for event '{$event->name}' is closed.");
                }
            }
        }
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        //
    }
}
