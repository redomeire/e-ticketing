<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profile extends Model
{
    use SoftDeletes;
    protected $fillable = [
        "user_id",
        'phone',
        'is_male',
        'date_of_birth',
    ];
    public function user()
    {
        return $this->belongsTo((User::class));
    }
}
