<?php

namespace App\Models;

use App\Models\Attendee;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'invoice_id',
        'payment_url',
        'status',
        'total_amount'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function orderItem()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function payment()
    {
        return $this->hasMany(Payment::class);
    }
    public function attendee()
    {
        return $this->hasMany(Attendee::class);
    }
}
