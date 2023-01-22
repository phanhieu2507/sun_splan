<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $table = 'documents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'doc_name',
        'limit',
        'url',
        'doc_content',
        'unit_id',
        'category_id',
        'user_id',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function planDetail()
    {
        return $this->hasMany(PlanDetail::class, 'doc_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'type_id', 'id');
    }
}
