<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreeContent extends Model
{
    use HasFactory;

    protected $table = 'free_contents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'content',
        'result',
        'target_detail_id',
    ];

    public function targetDetail()
    {
        return $this->belongsTo(TargetDetail::class, 'target_detail_id', 'id');
    }
}
