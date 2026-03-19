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
        'ticket_category_name',
        'seat_number',
        'base_price',
    ];
    protected $casts = [
        'price_at_purchase' => 'float',
        'base_price' => 'float',
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
