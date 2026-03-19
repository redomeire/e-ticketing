<?php

namespace App\Observers;

use App\Models\EventSeat;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class EventSeatObserver implements ShouldHandleEventsAfterCommit
{
    public function deleting(EventSeat $eventSeat): void
    {
        if ($eventSeat->orderItem()->exists()) {
            if ($eventSeat->isForceDeleting()) {
                throw new \Exception('Cannot delete a seat that already been ordered');
            }
        }
    }
}
