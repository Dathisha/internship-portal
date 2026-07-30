<?php

namespace Tests\Feature;

use App\Models\InternshipApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class InternshipWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_internship_application_submission_creates_record()
    {
        Mail::fake();
        Storage::fake('local');

        $file = UploadedFile::fake()->create('test_resume.pdf', 100, 'application/pdf');

        $response = $this->postJson('/api/internship-applications', [
            'full_name'            => 'John Doe',
            'email'                => 'john@example.com',
            'mobile'               => '9876543210',
            'college_name'         => 'Tech University',
            'department'           => 'Computer Science',
            'current_year'         => '3rd Year',
            'internship_domain'    => 'Full Stack Development',
            'internship_mode'      => 'Hybrid',
            'preferred_start_date' => '2026-08-01',
            'resume'               => $file,
            'motivation'           => 'I am eager to learn and build real-world web applications.',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('internship_applications', [
            'full_name' => 'John Doe',
            'email'     => 'john@example.com',
            'status'    => 'Pending',
        ]);
    }

    public function test_accept_application_updates_status_and_prevents_duplicate_actions()
    {
        Mail::fake();

        $application = InternshipApplication::create([
            'application_id'       => 'INTERN-2026-TEST1',
            'full_name'            => 'Alice Smith',
            'email'                => 'alice@example.com',
            'mobile'               => '9876543211',
            'college_name'         => 'MIT',
            'department'           => 'AI',
            'current_year'         => '4th Year',
            'internship_domain'    => 'AI & ML',
            'internship_mode'      => 'Remote',
            'preferred_start_date' => '2026-08-15',
            'resume_path'          => 'resumes/dummy.pdf',
            'motivation'           => 'Passionate about machine learning and backend engineering.',
            'status'               => 'Pending',
        ]);

        $acceptUrl = URL::temporarySignedRoute(
            'applications.accept',
            now()->addDays(7),
            ['token' => $application->application_id]
        );

        // First click: Accept
        $response = $this->get($acceptUrl);
        $response->assertStatus(200);
        $this->assertStringContainsString('Application Accepted Successfully', $response->getContent());

        $this->assertDatabaseHas('internship_applications', [
            'application_id' => 'INTERN-2026-TEST1',
            'status'         => 'Accepted',
        ]);

        // Second click: Should be prevented
        $repeatResponse = $this->get($acceptUrl);
        $repeatResponse->assertStatus(200);
        $this->assertStringContainsString('This application has already been processed.', $repeatResponse->getContent());
    }

    public function test_reject_application_updates_status_and_prevents_duplicate_actions()
    {
        Mail::fake();

        $application = InternshipApplication::create([
            'application_id'       => 'INTERN-2026-TEST2',
            'full_name'            => 'Bob Jones',
            'email'                => 'bob@example.com',
            'mobile'               => '9876543212',
            'college_name'         => 'Stanford',
            'department'           => 'ECE',
            'current_year'         => '2nd Year',
            'internship_domain'    => 'Embedded Systems',
            'internship_mode'      => 'Onsite',
            'preferred_start_date' => '2026-09-01',
            'resume_path'          => 'resumes/dummy2.pdf',
            'motivation'           => 'Interested in hardware and software integration.',
            'status'               => 'Pending',
        ]);

        $rejectUrl = URL::temporarySignedRoute(
            'applications.reject',
            now()->addDays(7),
            ['token' => $application->application_id]
        );

        // First click: Reject
        $response = $this->get($rejectUrl);
        $response->assertStatus(200);
        $this->assertStringContainsString('Application Rejected Successfully', $response->getContent());

        $this->assertDatabaseHas('internship_applications', [
            'application_id' => 'INTERN-2026-TEST2',
            'status'         => 'Rejected',
        ]);

        // Second click: Should be prevented
        $repeatResponse = $this->get($rejectUrl);
        $repeatResponse->assertStatus(200);
        $this->assertStringContainsString('This application has already been processed.', $repeatResponse->getContent());
    }

    public function test_api_get_internship_applications_returns_list()
    {
        InternshipApplication::create([
            'application_id'       => 'INTERN-2026-LIST1',
            'full_name'            => 'Charlie Brown',
            'email'                => 'charlie@example.com',
            'mobile'               => '9876543213',
            'college_name'         => 'Harvard',
            'department'           => 'CS',
            'current_year'         => '3rd Year',
            'internship_domain'    => 'Web Development',
            'internship_mode'      => 'Remote',
            'preferred_start_date' => '2026-09-01',
            'resume_path'          => 'resumes/dummy3.pdf',
            'motivation'           => 'Web dev fan',
            'status'               => 'Pending',
        ]);

        $response = $this->getJson('/api/internship-applications');
        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonFragment(['full_name' => 'Charlie Brown']);
    }

    public function test_api_accept_application_updates_status_sends_email_and_prevents_duplicate()
    {
        Mail::fake();

        $app = InternshipApplication::create([
            'application_id'       => 'INTERN-2026-ACC1',
            'full_name'            => 'Daisy Miller',
            'email'                => 'daisy@example.com',
            'mobile'               => '9876543214',
            'college_name'         => 'Oxford',
            'department'           => 'IT',
            'current_year'         => '4th Year',
            'internship_domain'    => 'Cybersecurity',
            'internship_mode'      => 'Onsite',
            'preferred_start_date' => '2026-09-10',
            'resume_path'          => 'resumes/dummy4.pdf',
            'motivation'           => 'Cybersecurity enthusiast',
            'status'               => 'Pending',
        ]);

        $acceptResponse = $this->postJson("/api/internship-applications/{$app->id}/accept");
        $acceptResponse->assertStatus(200)
                       ->assertJson(['success' => true, 'message' => 'Application accepted successfully.']);

        $this->assertDatabaseHas('internship_applications', [
            'id'     => $app->id,
            'status' => 'Accepted',
        ]);

        Mail::assertSent(\App\Mail\ApplicationAcceptedMail::class, function ($mail) use ($app) {
            return $mail->hasTo($app->email);
        });

        // Duplicate action check
        $duplicateResponse = $this->postJson("/api/internship-applications/{$app->id}/accept");
        $duplicateResponse->assertStatus(400)
                          ->assertJson(['success' => false, 'message' => 'This application has already been processed.']);
    }

    public function test_api_reject_application_updates_status_sends_email_and_prevents_duplicate()
    {
        Mail::fake();

        $app = InternshipApplication::create([
            'application_id'       => 'INTERN-2026-REJ1',
            'full_name'            => 'Ethan Hunt',
            'email'                => 'ethan@example.com',
            'mobile'               => '9876543215',
            'college_name'         => 'Cambridge',
            'department'           => 'Robotics',
            'current_year'         => '3rd Year',
            'internship_domain'    => 'DevOps',
            'internship_mode'      => 'Remote',
            'preferred_start_date' => '2026-10-01',
            'resume_path'          => 'resumes/dummy5.pdf',
            'motivation'           => 'DevOps expert',
            'status'               => 'Pending',
        ]);

        $rejectResponse = $this->postJson("/api/internship-applications/{$app->id}/reject");
        $rejectResponse->assertStatus(200)
                       ->assertJson(['success' => true, 'message' => 'Application rejected successfully.']);

        $this->assertDatabaseHas('internship_applications', [
            'id'     => $app->id,
            'status' => 'Rejected',
        ]);

        Mail::assertSent(\App\Mail\ApplicationRejectedMail::class, function ($mail) use ($app) {
            return $mail->hasTo($app->email);
        });

        // Duplicate action check
        $duplicateResponse = $this->postJson("/api/internship-applications/{$app->id}/reject");
        $duplicateResponse->assertStatus(400)
                          ->assertJson(['success' => false, 'message' => 'This application has already been processed.']);
    }
}
