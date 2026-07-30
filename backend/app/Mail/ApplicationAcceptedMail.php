<?php

namespace App\Mail;

use App\Models\InternshipApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationAcceptedMail extends Mailable
{
    use Queueable, SerializesModels;

    public InternshipApplication $application;

    public function __construct(InternshipApplication $application)
    {
        $this->application = $application;
    }

    public function build()
    {
        return $this
            ->subject('Internship Application Accepted')
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.application_accepted')
            ->with(['application' => $this->application]);
    }
}