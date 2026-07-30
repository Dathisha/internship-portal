<?php

namespace Tests\Feature;

use App\Models\InternshipApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class CertificateAndReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_certificate_generation_with_valid_application_id_returns_details()
    {
        $app = InternshipApplication::create([
            'application_id'       => 'INTERN-2026-VAL1',
            'full_name'            => 'Sarah Connor',
            'email'                => 'sarah@example.com',
            'mobile'               => '9876543299',
            'college_name'         => 'Tech College',
            'department'           => 'Computer Science',
            'current_year'         => '4th Year',
            'internship_domain'    => 'AI & Data Science',
            'internship_mode'      => 'Remote',
            'preferred_start_date' => '2026-07-01',
            'resume_path'          => 'resumes/sarah.pdf',
            'motivation'           => 'Excited about AI development',
            'status'               => 'Accepted',
        ]);

        $response = $this->getJson("/api/certificates/generate/{$app->application_id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'status'      => 'approved',
                     'certificate' => [
                         'certificate_id' => 'INTERN-2026-VAL1',
                         'candidate_name' => 'Sarah Connor',
                         'college_name'   => 'Tech College',
                         'domain'         => 'AI & Data Science',
                     ],
                 ]);
    }

    public function test_certificate_generation_is_case_insensitive_and_handles_trimming()
    {
        $app = InternshipApplication::create([
            'application_id'       => 'INTERN-2026-EP75',
            'full_name'            => 'John Smith',
            'email'                => 'john.smith@example.com',
            'mobile'               => '9876543200',
            'college_name'         => 'Harvard University',
            'department'           => 'Computer Science',
            'current_year'         => '3rd Year',
            'internship_domain'    => 'Full Stack Development',
            'internship_mode'      => 'Hybrid',
            'preferred_start_date' => '2026-08-01',
            'resume_path'          => 'resumes/john.pdf',
            'motivation'           => 'Passionate developer',
            'status'               => 'Accepted',
        ]);

        // Lowercase query test
        $responseLower = $this->getJson('/api/certificates/generate/intern-2026-ep75');
        $responseLower->assertStatus(200)
                      ->assertJson([
                          'status'      => 'approved',
                          'certificate' => [
                              'certificate_id' => 'INTERN-2026-EP75',
                              'candidate_name' => 'John Smith',
                          ],
                      ]);

        // Exact match query test
        $responseExact = $this->getJson('/api/certificates/generate/INTERN-2026-EP75');
        $responseExact->assertStatus(200)
                      ->assertJson([
                          'status'      => 'approved',
                          'certificate' => [
                              'certificate_id' => 'INTERN-2026-EP75',
                              'candidate_name' => 'John Smith',
                          ],
                      ]);
    }

    public function test_certificate_generation_with_invalid_application_id_returns_404_error()
    {
        $response = $this->getJson("/api/certificates/generate/INVALID-APP-ID-999");

        $response->assertStatus(404)
                 ->assertJson([
                     'status'  => 'invalid',
                     'message' => 'Invalid Application ID. Please check your Application ID and try again.',
                 ]);
    }

    public function test_monthly_company_report_command_generates_pdf_and_sends_email()
    {
        Mail::fake();

        // Create student registered in current month
        InternshipApplication::create([
            'application_id'       => 'INTERN-2026-REP1',
            'full_name'            => 'Alex Mercer',
            'email'                => 'alex@example.com',
            'mobile'               => '9876543219',
            'college_name'         => 'Global University',
            'department'           => 'Software Engineering',
            'current_year'         => '3rd Year',
            'internship_domain'    => 'Full Stack Development',
            'internship_mode'      => 'Hybrid',
            'preferred_start_date' => '2026-07-15',
            'resume_path'          => 'resumes/alex.pdf',
            'motivation'           => 'Full stack enthusiast',
            'status'               => 'Pending',
        ]);

        $exitCode = Artisan::call('reports:send-monthly', [
            '--month' => now()->month,
            '--year'  => now()->year,
        ]);

        $this->assertEquals(0, $exitCode);

        Mail::assertSent(\App\Mail\MonthlyReportMail::class, function ($mail) {
            return $mail->totalCount === 1;
        });
    }
}
