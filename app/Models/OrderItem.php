<?php

namespace App\Models;

use App\Models\Attendee;
use App\Models\EventSeat;
use App\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'order_id',
        'seat_id',
        'price_at_purchase',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function seat()
    {
        return $this->belongsTo(related: EventSeat::class);
    }
}
