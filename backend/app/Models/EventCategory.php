<?php

namespace App\Models;

use App\Models\Event;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventCategory extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
    ];
    public function events()
    {
        return $this->belongsToMany(Event::class, 'category_events');
    }
}
