<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanDetail extends Model
{
    use HasFactory;

    protected $table = 'plan_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'expected_amount',
        'real_amount',
        'doc_id',
        'plan_id',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'id');
    }

    public function document()
    {
        return $this->belongsTo(Document::class, 'doc_id', 'id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'plan_detail_id', 'id');
    }
}
