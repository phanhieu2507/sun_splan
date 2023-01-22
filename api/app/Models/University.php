<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;

    protected $table = 'universities';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'grade_code',
        'abbreviation',
        'image_id',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'universities_users', 'user_id', 'university_id');
    }

    public function gradeCodes()
    {
        return $this->hasMany(GradeCode::class, 'university_id', 'id');
    }

    public function image()
    {
        return $this->hasOne(Image::class, 'id', 'image_id');
    }
}
