<?php

namespace App\Models;

use App\Models\EventTicketCategory;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventSeat extends Model
{
    use SoftDeletes;
    public function category()
    {
        return $this->belongsTo(EventTicketCategory::class, 'event_ticket_category_id');
    }
    public function orderItem()
    {
        return $this->hasOne(OrderItem::class, 'seat_id');
    }
}
