<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'internship_application_id',
        'certificate_id',
        'candidate_name',
        'domain',
        'duration',
        'start_date',
        'end_date',
        'issue_date',
        'certificate_data',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'issue_date' => 'date',
    ];

    public function internshipApplication(): BelongsTo
    {
        return $this->belongsTo(InternshipApplication::class);
    }
}
