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
        'max_row',
        'max_column',
        'slug',
        'cover_image_url',
        'terms_and_conditions',
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
            $event->slug = $event->generateUniqueSlug($event->name);
        });
        static::updating(function ($event) {
            if ($event->isDirty('name')) {
                $event->slug = $event->generateUniqueSlug($event->name);
            }
        });
    }
    private function generateUniqueSlug($name)
    {
        $base_slug = Str::slug($name);
        $short_slug = Str::limit($base_slug, 40, '');
        $unique_suffix = strtolower(Str::random(5));
        return "{$short_slug}-{$unique_suffix}";
    }
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
