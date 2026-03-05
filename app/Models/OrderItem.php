<?php

namespace App\Models;

use App\Models\EventSeat;
use App\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use SoftDeletes;
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function seat()
    {
        return $this->belongsTo(related: EventSeat::class);
    }
}
