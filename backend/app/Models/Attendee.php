<?php

namespace App\Models;

use App\Models\EventSeat;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendee extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'is_male',
        'order_id',
        'seat_id',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function seat()
    {
        return $this->belongsTo(EventSeat::class);
    }
}
