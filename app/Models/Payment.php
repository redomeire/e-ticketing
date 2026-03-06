<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        "order_id",
        "external_id",
        "payment_method",
        "payment_channel",
        "amount",
        "status",
        "paid_at"
    ];
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
