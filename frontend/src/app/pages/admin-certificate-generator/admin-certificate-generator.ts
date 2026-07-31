import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { CertificateService } from '../../core/services/certificate.service';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface Candidate {
  id: number;
  full_name: string;
  email: string;
  internship_domain: string;
  preferred_start_date: string;
  mobile: string;
  college_name: string;
}

interface Certificate {
  id?: number;
  candidateName: string;
  domain: string;
  duration: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  certificateId: string;
  companyName: string;
  companyLogo: string;
}

@Component({
  selector: 'app-admin-certificate-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent, SafePipe],
  templateUrl: './admin-certificate-generator.html',
  styleUrl: './admin-certificate-generator.css',
})
export class AdminCertificateGeneratorComponent implements OnInit {
  @ViewChild('certificatePreview', { static: false }) certificatePreview?: ElementRef;

  candidates: Candidate[] = [];
  certificateForm: FormGroup;
  isLoading = false;
  showPreview = false;
  previewUrl: string | null = null;
  successMessage = '';
  errorMessage = '';
  isSaving = false;
  isSendingEmail = false;
  emailSentMessage = '';
  savedCertificateId: string | null = null;
  currentCertificate: Certificate | null = null;
  selectedCandidate: Candidate | null = null;

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService,
  ) {
    this.certificateForm = this.fb.group({
      candidateId: ['', [Validators.required]],
      duration: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
      endDate: ['', [Validators.required]],
    });

    this.certificateForm.get('duration')?.valueChanges.subscribe(() => {
      this.autoCalculateEndDate();
    });
  }

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    this.certificateService.getApprovedCandidates().subscribe({
      next: (data: Candidate[]) => {
        this.candidates = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading candidates:', err);
        this.errorMessage = 'Failed to load candidates. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onCandidateSelect(candidateId: string): void {
    const candidate = this.candidates.find((c) => c.id === parseInt(candidateId));
    if (candidate) {
      this.selectedCandidate = candidate;
      this.certificateForm.patchValue({
        candidateId: candidateId,
      });
      this.autoCalculateEndDate();
    }
  }

  autoCalculateEndDate(): void {
    if (!this.selectedCandidate || !this.selectedCandidate.preferred_start_date) return;
    const duration = parseInt(this.certificateForm.get('duration')?.value || '1', 10);
    if (isNaN(duration) || duration < 1) return;

    const startDate = new Date(this.selectedCandidate.preferred_start_date);
    startDate.setMonth(startDate.getMonth() + duration);
    const endDateStr = startDate.toISOString().split('T')[0];
    this.certificateForm.patchValue({ endDate: endDateStr }, { emitEvent: false });
  }

  generatePreview(): void {
    if (this.certificateForm.invalid || !this.selectedCandidate) {
      this.errorMessage = 'Please fill in all required fields and select a candidate.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.autoCalculateEndDate();

    const formData = this.certificateForm.value;
    const certificateData: Certificate = {
      candidateName: this.selectedCandidate.full_name,
      domain: this.selectedCandidate.internship_domain,
      duration: formData.duration,
      startDate: this.selectedCandidate.preferred_start_date,
      endDate: formData.endDate,
      issueDate: new Date().toISOString().split('T')[0],
      certificateId: this.generateCertificateId(),
      companyName: 'Crescent Technosoft',
      companyLogo: 'assets/logo.png',
    };

    this.currentCertificate = certificateData;
    this.generateCertificatePreview(certificateData);
    this.showPreview = true;
    this.isLoading = false;
  }

  async generateCertificatePreview(certificate: Certificate): Promise<void> {
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Set background color
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Border
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(0, 87, 179);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Decorative top border
      pdf.setDrawColor(0, 123, 255);
      pdf.setLineWidth(2);
      pdf.line(10, 20, pageWidth - 10, 20);

      // Company Name
      pdf.setFontSize(28);
      pdf.setTextColor(0, 56, 179);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Certificate of Completion', pageWidth / 2, 40, { align: 'center' });

      // Divider
      pdf.setDrawColor(0, 123, 255);
      pdf.setLineWidth(0.5);
      pdf.line(40, 50, pageWidth - 40, 50);

      // Company details
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${certificate.companyName}`, pageWidth / 2, 60, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('Professional Internship Program', pageWidth / 2, 67, { align: 'center' });

      // Certificate content
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');

      let yPosition = 85;
      pdf.text('This is to certify that', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      // Candidate Name
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 56, 179);
      pdf.text(certificate.candidateName, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Certificate details
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');

      const detailsText = [
        `has successfully completed the internship program in ${certificate.domain}`,
        `with a duration of ${certificate.duration} month(s)`,
        `from ${this.formatDate(certificate.startDate)} to ${this.formatDate(certificate.endDate)}`,
      ];

      detailsText.forEach((text) => {
        pdf.text(text, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 7;
      });

      yPosition += 8;
      pdf.text(
        'This certificate is a recognition of their dedication and achievement.',
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      );

      // Footer details
      yPosition += 20;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Certificate ID: ${certificate.certificateId}`, 20, yPosition);
      pdf.text(`Issue Date: ${this.formatDate(certificate.issueDate)}`, pageWidth - 60, yPosition);

      // QR Code
      try {
        const qrCanvas = await QRCode.toCanvas(
          `https://intern2expert.com/verify-certificate/${certificate.certificateId}`
        );
        const qrImage = qrCanvas.toDataURL('image/png');
        pdf.addImage(qrImage, 'PNG', pageWidth - 50, pageHeight - 50, 30, 30);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }

      // Digital signature area
      yPosition = pageHeight - 35;
      try {
        const sigImg = new Image();
        sigImg.src = 'assets/authorized-signature.png';
        await new Promise((resolve) => {
          sigImg.onload = resolve;
          sigImg.onerror = resolve;
        });
        if (sigImg.complete && sigImg.naturalWidth > 0) {
          const imgW = 38;
          const imgH = (sigImg.naturalHeight / sigImg.naturalWidth) * imgW;
          pdf.addImage(sigImg, 'PNG', pageWidth - 45 - (imgW / 2), yPosition - imgH + 1.5, imgW, imgH);
        }
      } catch (e) {
        console.warn('Failed to load signature in admin preview:', e);
      }

      const issueDateStr = this.formatDateDDMMYYYY(certificate.issueDate || new Date().toISOString());
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text(issueDateStr, 45, yPosition - 2, { align: 'center' });

      pdf.setLineWidth(0.5);
      pdf.setDrawColor(150, 150, 150);
      pdf.line(20, yPosition, 70, yPosition);
      pdf.setFontSize(9);
      pdf.text('Issued Date', 45, yPosition + 5, { align: 'center' });

      pdf.line(pageWidth - 70, yPosition, pageWidth - 20, yPosition);
      pdf.text('Authorized Signature', pageWidth - 65, yPosition + 5);

      // Convert to image for preview
      const dataUrl = pdf.output('dataurlstring');
      this.previewUrl = dataUrl;
    } catch (err) {
      console.error('Error generating certificate:', err);
      this.errorMessage = 'Failed to generate certificate preview.';
    }
  }

  downloadPDF(): void {
    if (!this.currentCertificate) {
      return;
    }

    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Set background
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Border
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(0, 87, 179);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Decorative top border
      pdf.setDrawColor(0, 123, 255);
      pdf.setLineWidth(2);
      pdf.line(10, 20, pageWidth - 10, 20);

      // Company Name
      pdf.setFontSize(28);
      pdf.setTextColor(0, 56, 179);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Certificate of Completion', pageWidth / 2, 40, { align: 'center' });

      // Divider
      pdf.setDrawColor(0, 123, 255);
      pdf.setLineWidth(0.5);
      pdf.line(40, 50, pageWidth - 40, 50);

      // Company details
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${this.currentCertificate.companyName}`, pageWidth / 2, 60, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('Professional Internship Program', pageWidth / 2, 67, { align: 'center' });

      // Certificate content
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');

      let yPosition = 85;
      pdf.text('This is to certify that', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      // Candidate Name
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 56, 179);
      pdf.text(this.currentCertificate.candidateName, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Certificate details
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');

      const detailsText = [
        `has successfully completed the internship program in ${this.currentCertificate.domain}`,
        `with a duration of ${this.currentCertificate.duration} month(s)`,
        `from ${this.formatDate(this.currentCertificate.startDate)} to ${this.formatDate(this.currentCertificate.endDate)}`,
      ];

      detailsText.forEach((text) => {
        pdf.text(text, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 7;
      });

      yPosition += 8;
      pdf.text(
        'This certificate is a recognition of their dedication and achievement.',
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      );

      // Footer details
      yPosition += 20;
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Certificate ID: ${this.currentCertificate.certificateId}`, 20, yPosition);
      pdf.text(
        `Issue Date: ${this.formatDate(this.currentCertificate.issueDate)}`,
        pageWidth - 60,
        yPosition
      );

      const certId = this.currentCertificate.certificateId;
      const candidateName = this.currentCertificate.candidateName;

      const finalizePdf = async (pdfDoc: typeof pdf) => {
        const sigY = pageHeight - 35;
        try {
          const sigImg = new Image();
          sigImg.src = 'assets/authorized-signature.png';
          await new Promise((resolve) => {
            sigImg.onload = resolve;
            sigImg.onerror = resolve;
          });
          if (sigImg.complete && sigImg.naturalWidth > 0) {
            const imgW = 38;
            const imgH = (sigImg.naturalHeight / sigImg.naturalWidth) * imgW;
            pdfDoc.addImage(sigImg, 'PNG', pageWidth - 45 - (imgW / 2), sigY - imgH + 1.5, imgW, imgH);
          }
        } catch (e) {
          console.warn('Failed to load signature in admin download:', e);
        }

        const issueDateStr = this.formatDateDDMMYYYY(this.currentCertificate?.issueDate || new Date().toISOString());
        pdfDoc.setFontSize(9);
        pdfDoc.setFont('helvetica', 'bold');
        pdfDoc.setTextColor(80, 80, 80);
        pdfDoc.text(issueDateStr, 45, sigY - 2, { align: 'center' });

        pdfDoc.setLineWidth(0.5);
        pdfDoc.setDrawColor(150, 150, 150);
        pdfDoc.line(20, sigY, 70, sigY);
        pdfDoc.setFontSize(9);
        pdfDoc.text('Issued Date', 45, sigY + 5, { align: 'center' });
        pdfDoc.line(pageWidth - 70, sigY, pageWidth - 20, sigY);
        pdfDoc.text('Authorized Signature', pageWidth - 65, sigY + 5);
        pdfDoc.save(`${candidateName}-Certificate-${certId}.pdf`);
      };

      // Use Promise-based QRCode.toCanvas (correctly typed, no callback overload)
      QRCode.toCanvas(
        `https://intern2expert.com/verify-certificate/${certId}`
      ).then((canvas: HTMLCanvasElement) => {
        try {
          const qrImage = canvas.toDataURL('image/png');
          pdf.addImage(qrImage, 'PNG', pageWidth - 50, pageHeight - 50, 30, 30);
        } catch (_e) { /* ignore QR embed failure */ }
        finalizePdf(pdf);
      }).catch(() => {
        finalizePdf(pdf);
      });

    } catch (err) {
      console.error('Error downloading PDF:', err);
      this.errorMessage = 'Failed to download certificate. Please try again.';
    }
  }

  saveCertificate(): void {
    if (!this.currentCertificate || !this.selectedCandidate) {
      this.errorMessage = 'No certificate to save.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const certificateData = {
      internship_application_id: this.selectedCandidate.id,
      certificate_id: this.currentCertificate.certificateId,
      candidate_name: this.currentCertificate.candidateName,
      domain: this.currentCertificate.domain,
      duration: this.currentCertificate.duration,
      start_date: this.currentCertificate.startDate,
      end_date: this.currentCertificate.endDate,
      issue_date: this.currentCertificate.issueDate,
    };

    this.certificateService.saveCertificate(certificateData).subscribe({
      next: () => {
        this.successMessage = 'Certificate saved successfully!';
        this.savedCertificateId = this.currentCertificate!.certificateId;
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error saving certificate:', err);
        this.errorMessage = err.error?.message || 'Failed to save certificate. Please try again.';
        this.isSaving = false;
      },
    });
  }

  printCertificate(): void {
    if (this.previewUrl) {
      const printWindow = window.open(this.previewUrl);
      if (printWindow) {
        printWindow.print();
      }
    }
  }

  sendCertificateEmail(): void {
    if (!this.savedCertificateId) {
      this.emailSentMessage = '';
      this.errorMessage = 'Please save the certificate first before sending the email.';
      return;
    }

    this.isSendingEmail = true;
    this.emailSentMessage = '';
    this.errorMessage = '';

    this.certificateService.sendCertificateEmail(this.savedCertificateId).subscribe({
      next: () => {
        this.isSendingEmail = false;
        this.emailSentMessage = `Certificate email sent successfully to the student!`;
        setTimeout(() => {
          this.resetForm();
        }, 3000);
      },
      error: (err) => {
        console.error('Error sending certificate email:', err);
        this.errorMessage = err.error?.message || 'Failed to send certificate email. Please try again.';
        this.isSendingEmail = false;
      },
    });
  }

  private generateCertificateId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `CERT-${timestamp}-${random}`;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  private formatDateDDMMYYYY(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private resetForm(): void {
    this.certificateForm.reset();
    this.selectedCandidate = null;
    this.showPreview = false;
    this.previewUrl = null;
    this.currentCertificate = null;
    this.savedCertificateId = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.emailSentMessage = '';
  }
}
