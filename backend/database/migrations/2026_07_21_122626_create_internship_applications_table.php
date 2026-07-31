<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('internship_applications', function (Blueprint $table) {
        $table->id();
        $table->string('application_id')->unique();
        $table->string('full_name');
        $table->string('email');
        $table->string('mobile');
        $table->string('college_name');
        $table->string('department');
        $table->string('current_year');
        $table->string('internship_domain');
        $table->string('internship_mode');
        $table->integer('duration')->default(1);
        $table->date('preferred_start_date');
        $table->string('resume_path');
        $table->string('linkedin_url')->nullable();
        $table->string('github_url')->nullable();
        $table->text('motivation');
        $table->string('status')->default('Pending');
        $table->timestamps();
    });
}
    public function down(): void
    {
        Schema::dropIfExists('internship_applications');
    }
};
