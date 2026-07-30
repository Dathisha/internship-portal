<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|digits:10',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:20|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            // Send email to admin
            Mail::to(config('mail.from.address'))->send(new ContactMail($request->all()));

            return response()->json([
                'message' => 'Contact message sent successfully',
                'status' => 'success',
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Contact form error: ' . $e->getMessage());

            return response()->json(['message' => 'Failed to send message'], 500);
        }
    }
}
