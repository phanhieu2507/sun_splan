<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'vietnamese_fullname',
        'japanese_fullname',
        'avatar',
        'role',
        'grade_code',
        'receive_naitei_date',
        'email',
        'password',
        'graduation_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function scopeGraduationYear($query, $request)
    {
        if ($request->has('graduation_year')) {
            $query->whereYear('graduation_date', $request->input('graduation_year'));
        }

        return $query;
    }

    public function scopeCompany($query, $request)
    {
        if ($request->has('company_id')) {
            $query->join('companies_users', 'users.id', '=', 'companies_users.user_id')->where('companies_users.company_id', $request->input('company_id'));
        }

        return $query;
    }

    public function scopeRole($query, $roleId)
    {
        return $query->where('role', $roleId);
    }

    public function scopeName($query, $request)
    {
        if ($request->has('name')) {
            $query->where('vietnamese_fullname', 'like', '%'.$request->input('name').'%')
                ->orWhere('japanese_fullname', 'like', '%'.$request->input('name').'%');
        }

        return $query;
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'user_id', 'id');
    }

    public function contests()
    {
        return $this->hasMany(Contest::class, 'user_id', 'id');
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class, 'companies_users', 'user_id', 'company_id');
    }

    public function likes()
    {
        return $this->belongsToMany(Post::class, 'likes', 'user_id', 'post_id');
    }

    public function comments()
    {
        return $this->belongsToMany(Post::class, 'comments', 'user_id', 'post_id')->withPivot('content');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id', 'id');
    }

    public function universities()
    {
        return $this->belongsToMany(University::class, 'universities_users', 'user_id', 'university_id');
    }

    public function targets()
    {
        return $this->hasMany(Target::class, 'user_id', 'id');
    }

    public function plans()
    {
        return $this->hasMany(Plan::class, 'user_id', 'id');
    }
}
