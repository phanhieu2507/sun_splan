<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScoreEach extends Model
{
    use HasFactory;

    protected $table = 'score_eaches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'part_name',
        'expected_score',
        'result',
        'test_content_id',
    ];

    public function testContent()
    {
        return $this->belongsTo(TestContent::class, 'test_content_id', 'id');
    }
}
