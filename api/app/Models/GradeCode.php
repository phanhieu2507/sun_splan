<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeCode extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';

    protected $table = 'grade_codes';

    protected $fillable = [
        'university_id',
        'code',
        'year',
    ];

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id', 'id');
    }
}
