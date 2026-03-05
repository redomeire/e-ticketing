<?php

namespace App\Models;

use App\Models\EventTicketCategory;
use App\Models\OrderItem;
use App\Observers\EventSeatObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([EventSeatObserver::class])]
class EventSeat extends Model
{
    use SoftDeletes;
    public function category()
    {
        return $this->belongsTo(EventTicketCategory::class, 'category_id');
    }
    public function orderItem()
    {
        return $this->hasOne(OrderItem::class, 'seat_id');
    }
}
