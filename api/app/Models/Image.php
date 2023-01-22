<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $table = 'images';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'img_link',
        'is_thumbnail',
        'type_id',
        'type',
    ];

    public function documents()
    {
        return $this->belongsTo(Document::class, 'type_id', 'id');
    }

    public function contests()
    {
        return $this->belongsTo(Contest::class, 'type_id', 'id');
    }
}
