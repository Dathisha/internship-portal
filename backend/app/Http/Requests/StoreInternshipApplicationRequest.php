<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInternshipApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:20',
            'college_name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'current_year' => 'required|string|max:50',
            'internship_domain' => 'required|string|max:100',
            'internship_mode' => 'required|string|max:100',
            'preferred_start_date' => 'required|date',
            'resume' => 'required|file|mimes:pdf|max:5120',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'motivation' => 'required|string|min:20',
        ];
    }
}
