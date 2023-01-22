<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    public function documents()
    {
        return $this->hasMany(Document::class, 'category_id', 'id');
    }

    public function targetDetails()
    {
        return $this->hasMany(TargetDetail::class, 'category_id', 'id');
    }
}
