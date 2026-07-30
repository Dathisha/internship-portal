import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { CertificateService } from '../../core/services/certificate.service';

@Component({
  selector: 'app-verify-certificate',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './verify-certificate.html',
  styleUrl: './verify-certificate.css',
})
export class VerifyCertificateComponent implements OnInit {
  certificateId: string | null = null;
  certificate: any = null;
  isLoading = false;
  errorMessage = '';
  isVerified = false;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.certificateId = params['id'];
      if (this.certificateId) {
        this.verifyCertificate();
      }
    });
  }

  verifyCertificate(): void {
    if (!this.certificateId) {
      this.errorMessage = 'No certificate ID provided.';
      return;
    }

    this.isLoading = true;
    this.certificateService.verifyCertificate(this.certificateId).subscribe({
      next: (data: any) => {
        if (data.valid) {
          this.certificate = data.certificate;
          this.isVerified = true;
        } else {
          this.errorMessage = 'Certificate not found or invalid.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error verifying certificate:', err);
        this.errorMessage = 'Failed to verify certificate. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
}
