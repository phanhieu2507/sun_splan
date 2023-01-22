<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contest extends Model
{
    use HasFactory;

    protected $table = 'contests';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */


    protected $fillable = [
        'contest_name',
        'pass_score',
        'user_id',
        'image_id',
        'category_id',
        'total_score',
    ];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function contestScoreEachs()
    {
        return $this->hasMany(ContestScoreEach::class, 'contest_id', 'id');
    }

    public function testContents()
    {
        return $this->hasMany(TestContent::class, 'contest_id', 'id');
    }

    public function image()
    {
        return $this->belongsTo(Image::class, 'image_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
}
