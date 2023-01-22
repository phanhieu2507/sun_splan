<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContestScoreEach extends Model
{
    use HasFactory;

    protected $table = 'contest_score_eaches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'contest_id',
        'max_score',
    ];

    public function contest()
    {
        return $this->belongsTo(Contest::class, 'contest_id', 'id');
    }
}
