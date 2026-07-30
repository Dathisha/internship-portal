<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactData;

    public function __construct($data)
    {
        $this->contactData = $data;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Form Submission: ' . $this->contactData['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
            with: [
                'name' => $this->contactData['name'],
                'email' => $this->contactData['email'],
                'phone' => $this->contactData['phone'],
                'subject' => $this->contactData['subject'],
                'message' => $this->contactData['message'],
            ],
        );
    }
}
