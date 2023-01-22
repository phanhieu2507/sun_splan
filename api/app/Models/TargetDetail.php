<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TargetDetail extends Model
{
    use HasFactory;

    protected $table = 'target_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'target_id',
        'category_id',
        'type',
    ];

    public function target()
    {
        return $this->belongsTo(Target::class, 'target_id', 'id');
    }

    public function testContent()
    {
        return $this->hasOne(TestContent::class, 'target_detail_id', 'id');
    }

    public function freeContent()
    {
        return $this->hasOne(FreeContent::class, 'target_detail_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
}
