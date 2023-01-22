<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestContent extends Model
{
    use HasFactory;

    protected $table = 'test_contents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'target_detail_id',
        'contest_id',
        'date_of_contest',
    ];

    public function targetDetail()
    {
        return $this->belongsTo(TargetDetail::class, 'target_detail_id', 'id');
    }

    public function contest()
    {
        return $this->belongsTo(Contest::class, 'contest_id', 'id');
    }

    public function scoreEachs()
    {
        return $this->hasMany(ScoreEach::class, 'test_content_id', 'id');
    }
}
