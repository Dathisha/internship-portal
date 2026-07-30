<!-- Contact Form Email Template -->
<x-mail::message>
# New Contact Form Submission

<strong>Subject:</strong> {{ $subject }}

<strong>From:</strong> {{ $name }}

<strong>Email:</strong> {{ $email }}

<strong>Phone:</strong> {{ $phone }}

---

## Message:

{!! nl2br(e($message)) !!}

---

<x-mail::footer>
This is an automated email from your contact form at Intern 2 Expert.
</x-mail::footer>
</x-mail::message>
