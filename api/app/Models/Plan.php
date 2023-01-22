<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plans';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'target_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function planDetails()
    {
        return $this->hasMany(PlanDetail::class, 'plan_id', 'id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'plan_id', 'id');
    }

    public function target()
    {
        return $this->belongsTo(Target::class, 'target_id', 'id');
    }
}
