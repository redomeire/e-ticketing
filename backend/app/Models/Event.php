<?php

namespace App\Models;

use App\Models\EventTicketCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Event extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'is_active',
        'start_time',
        'end_time',
        'location',
        'max_row_index',
        'max_column_index',
        'slug',
    ];
    public function ticketCategories()
    {
        return $this->hasMany(EventTicketCategory::class);
    }
    public function categories()
    {
        return $this->belongsToMany(EventCategory::class, 'category_events');
    }
    protected static function booted()
    {
        static::creating(function ($event) {
            $base_slug = Str::slug($event->name);
            $short_slug = Str::limit($base_slug, 40, '');
            $unique_suffix = strtolower(Str::random(5));
            $event->slug = "{$short_slug}-{$unique_suffix}";
        });
    }
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
