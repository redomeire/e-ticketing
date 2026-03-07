<?php

namespace App\Models;

use App\Models\OrderItem;
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
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
