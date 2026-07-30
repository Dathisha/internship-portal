<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_application_id')->constrained('internship_applications')->onDelete('cascade');
            $table->string('certificate_id')->unique();
            $table->string('candidate_name');
            $table->string('domain');
            $table->integer('duration');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('issue_date');
            $table->text('certificate_data')->nullable();
            $table->enum('status', ['pending', 'approved', 'verified'])->default('pending');
            $table->timestamps();
            $table->index('certificate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
