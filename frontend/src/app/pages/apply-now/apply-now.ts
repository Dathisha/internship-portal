import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { InternshipApplicationService } from '../../core/services/internship-application.service';

@Component({
  selector: 'app-apply-now',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './apply-now.html',
  styleUrl: './apply-now.css',
})
export class ApplyNowComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  applicationForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private internshipService: InternshipApplicationService,
  ) {
    this.applicationForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      college_name: ['', [Validators.required, Validators.maxLength(255)]],
      department: ['', [Validators.required, Validators.maxLength(255)]],
      current_year: ['', [Validators.required, Validators.maxLength(50)]],
      internship_domain: ['', Validators.required],
      internship_mode: ['Hybrid', Validators.required],
      duration: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
      preferred_start_date: ['', Validators.required],
      resume: [null, [Validators.required]],
      linkedin_url: ['', [Validators.pattern(/https?:\/\/.+/)]],
      github_url: ['', [Validators.pattern(/https?:\/\/.+/)]],
      motivation: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['domain']) {
        this.applicationForm.patchValue({ internship_domain: params['domain'] });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Resume must be a PDF, DOC, or DOCX file.';
      this.applicationForm.patchValue({ resume: null });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Resume must be 5 MB or smaller.';
      this.applicationForm.patchValue({ resume: null });
      return;
    }

    this.errorMessage = '';
    this.applicationForm.patchValue({ resume: file });
  }

  submitApplication(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      this.errorMessage = 'Please complete all required fields correctly.';
      return;
    }

    const formData = new FormData();
    const formValue = this.applicationForm.value;

    Object.entries(formValue).forEach(([key, value]) => {
      if (key === 'resume' && value instanceof File) {
        formData.append('resume', value);
      } else if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    this.isSubmitting = true;
    this.internshipService.submitApplication(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Application Submitted Successfully! We will review your application and get back to you.';
        this.applicationForm.reset({ internship_mode: 'Hybrid' });
        // Clear the native file input so the control is truly reset
        if (this.fileInputRef?.nativeElement) {
          this.fileInputRef.nativeElement.value = '';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Application submission error:', err);
        if (err.status === 422 && err.error?.errors) {
          const firstError = Object.values(err.error.errors as Record<string, string[]>)[0];
          this.errorMessage = Array.isArray(firstError) ? firstError[0] : 'Please complete all required fields correctly.';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unable to submit application right now. Please check your connection and ensure your resume is a PDF/DOC/DOCX under 5 MB.';
        }
      },
    });
  }
}
