<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternshipApplication extends Model
{
    protected $fillable = [
        'application_id',
        'full_name',
        'email',
        'mobile',
        'college_name',
        'department',
        'current_year',
        'internship_domain',
        'internship_mode',
        'preferred_start_date',
        'resume_path',
        'linkedin_url',
        'github_url',
        'motivation',
        'status',
    ];
}