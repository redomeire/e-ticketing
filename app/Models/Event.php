<?php

namespace App\Models;

use App\Models\EventTicketCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'is_active',
        'date',
        'max_row_index',
        'max_column_index'
    ];
    public function categories()
    {
        return $this->hasMany(EventTicketCategory::class);
    }
}
