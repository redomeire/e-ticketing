<?php

namespace App\Models;

use App\Models\Attendee;
use App\Models\EventTicketCategory;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventSeat extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'event_id',
        'ticket_category_id',
        'seat_number',
        'is_available',
        'locked_until',
        'price',
        'row_index',
        'column_index',
    ];
    public function ticketCategory()
    {
        return $this->belongsTo(EventTicketCategory::class, 'ticket_category_id');
    }
    public function orderItem()
    {
        return $this->hasOne(OrderItem::class, 'seat_id');
    }
    public function attendee()
    {
        return $this->hasOne(Attendee::class, 'seat_id');
    }
}
