<?php

namespace App\Models;

use App\Models\EventTicketCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;
    public function categories()
    {
        return $this->hasMany(EventTicketCategory::class);
    }
}
