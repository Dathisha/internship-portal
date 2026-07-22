<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInternshipApplicationRequest;
use App\Mail\InternshipApplicationMail;
use App\Models\InternshipApplication;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InternshipApplicationController extends Controller
{
    public function store(StoreInternshipApplicationRequest $request)
    {
        $validated = $request->validated();

        $resumeFile = $request->file('resume');
        $resumePath = $resumeFile->store('resumes', 'local');
        $resumeOriginalName = $resumeFile->getClientOriginalName();
        $resumeSizeKb = $resumeFile->getSize() ? round($resumeFile->getSize() / 1024, 2) : null;

        $applicationId = $this->generateUniqueApplicationId();

        $application = InternshipApplication::create([
            'application_id' => $applicationId,
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'mobile' => $validated['mobile'],
            'college_name' => $validated['college_name'],
            'department' => $validated['department'],
            'current_year' => $validated['current_year'],
            'internship_domain' => $validated['internship_domain'],
            'internship_mode' => $validated['internship_mode'],
            'preferred_start_date' => $validated['preferred_start_date'],
            'resume_path' => $resumePath,
            'linkedin_url' => $validated['linkedin_url'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'motivation' => $validated['motivation'],
            'status' => 'Pending',
        ]);

        try {
            $recipient = config('mail.to');
            if ($recipient) {
                Mail::to($recipient)->send(new InternshipApplicationMail($application, [
                    'original_name' => $resumeOriginalName,
                    'size_kb' => $resumeSizeKb,
                ]));
            } else {
                Log::warning('Internship application email was skipped because MAIL_TO_ADDRESS is not configured.', [
                    'application_id' => $application->application_id,
                ]);
            }
        } catch (\Throwable $exception) {
            dd($exception->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully',
            'application_id' => $application->application_id,
        ], 201);
    }

    private function generateUniqueApplicationId(): string
    {
        do {
            $applicationId = 'INTERN-' . date('Y') . '-' . strtoupper(Str::random(4));
        } while (InternshipApplication::where('application_id', $applicationId)->exists());

        return $applicationId;
    }
}
