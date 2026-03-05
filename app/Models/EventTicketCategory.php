<?php

namespace App\Models;

use App\Models\Event;
use App\Models\EventSeat;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventTicketCategory extends Model
{
    use SoftDeletes;
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function seats()
    {
        return $this->hasMany(EventSeat::class, 'event_ticket_category_id');
    }
}
