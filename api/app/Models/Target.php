<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Target extends Model
{
    use HasFactory;

    protected $table = 'targets';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

     /** @OA\Schema(
      *     schema="Target",
      *     required={"id, user_id", "date_of_target", "is_completed"},
      * @OA\Property(
      *         property="id",
      *         type="integer",
      *     ),
      * @OA\Property(
      *         property="user_id",
      *         type="integer",
      *     ),
      * @OA\Property(
      *         property="date_of_target",
      *         type="string",
      *         format="date-time"
      *     ),
      * @OA\Property(
      *         property="is_completed",
      *         type="integer",
      *         description="0:not completed 1:completed"
      *     ),
      * )
      */
    protected $fillable = [
        'user_id',
        'date_of_target',
        'is_completed',
    ];

    public function targetDetails()
    {
        return $this->hasMany(TargetDetail::class, 'target_id', 'id');
    }

    public function plan()
    {
        return $this->hasOne(Plan::class, 'target_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'target_id', 'id');
    }
}
