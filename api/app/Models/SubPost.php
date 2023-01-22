<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubPost extends Model
{
    use HasFactory;

    protected $table = 'sub_posts';


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'post_id',
        'content',
        'sub_content',
        'contest_name',
        'contest_date',
        'max_score',
        'expected_score',
        'achieved_score',
        'document_name',
        'type',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }
}
