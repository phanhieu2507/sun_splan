<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'content',
        'planDetail_id',
        'plan_id',
        'target_id',
        'real_amount',
        'real_time',
        'type',
        'sub_content',
        'contest_name',
        'contest_date',
        'max_score',
        'expected_score',
        'achieved_score',
        'document_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function comments()
    {
        return $this->belongsToMany(User::class, 'comments', 'post_id', 'user_id')->withPivot('content');
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'likes', 'post_id', 'user_id');
    }

    public function targets()
    {
        return $this->belongsTo(Target::class, 'target_id', 'id');
    }

    public function plans()
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }

    public function planDetails()
    {
        return $this->belongsTo(PlanDetail::class, 'plan_detail_id', 'id');
    }

    public function subPosts()
    {
        return $this->hasMany(SubPost::class, 'post_id', 'id');
    }
}
