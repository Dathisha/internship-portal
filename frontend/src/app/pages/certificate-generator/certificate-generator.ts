import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { CertificateService } from '../../core/services/certificate.service';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface CertificateData {
  certificate_id: string;
  candidate_name: string;
  college_name: string;
  domain: string;
  duration: number;
  start_date: string;
  end_date: string;
  issue_date: string;
  status: string;
}

type PageState = 'form' | 'loading' | 'invalid' | 'pending' | 'preview';

@Component({
  selector: 'app-certificate-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './certificate-generator.html',
  styleUrl: './certificate-generator.css',
})
export class CertificateGeneratorComponent implements OnInit {
  certForm: FormGroup;
  pageState: PageState = 'form';
  certificate: CertificateData | null = null;
  errorDetail = '';

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private cdr: ChangeDetectorRef,
  ) {
    this.certForm = this.fb.group({
      certificateId: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.certForm.invalid) {
      this.certForm.markAllAsTouched();
      return;
    }

    const id = this.certForm.value.certificateId.trim();
    this.pageState = 'loading';
    this.certificate = null;
    this.errorDetail = '';
    this.cdr.detectChanges();

    this.certificateService.generateCertificate(id).subscribe({
      next: (res: any) => {
        if (res && res.certificate) {
          this.certificate = res.certificate;
          this.pageState = 'preview';
        } else {
          this.pageState = 'invalid';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.pageState = 'invalid';
        this.errorDetail = err.error?.message || 'Invalid Application ID. Please check your Application ID and try again.';
        this.cdr.detectChanges();
      },
    });
  }

  reset(): void {
    this.certForm.reset();
    this.pageState = 'form';
    this.certificate = null;
    this.errorDetail = '';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  printCertificate(): void {
    window.print();
  }

  async downloadPDF(): Promise<void> {
    if (!this.certificate) return;

    const cert = this.certificate;
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth();  // 297
    const ph = pdf.internal.pageSize.getHeight(); // 210

    // ── Background ──────────────────────────────────────────────
    pdf.setFillColor(252, 250, 255);
    pdf.rect(0, 0, pw, ph, 'F');

    // ── Outer border double-line ─────────────────────────────────
    pdf.setDrawColor(91, 44, 131);
    pdf.setLineWidth(1.2);
    pdf.rect(8, 8, pw - 16, ph - 16);
    pdf.setLineWidth(0.4);
    pdf.setDrawColor(124, 58, 237);
    pdf.rect(12, 12, pw - 24, ph - 24);

    // ── Gold top accent bar ──────────────────────────────────────
    pdf.setFillColor(91, 44, 131);
    pdf.rect(12, 12, pw - 24, 18, 'F');

    // ── Corner ornaments ─────────────────────────────────────────
    const ornamentSize = 12;
    const corners = [[12, 12], [pw - 12, 12], [12, ph - 12], [pw - 12, ph - 12]];
    pdf.setFillColor(124, 58, 237);
    corners.forEach(([cx, cy]) => {
      pdf.circle(cx, cy, ornamentSize * 0.4, 'F');
    });

    // ── Logo area (top-left) ─────────────────────────────────────
    // We'll write text "CT" as placeholder since we can't easily embed image in jsPDF without base64
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CRESCENT TECHNOSOFT', pw / 2, 22.5, { align: 'center' });

    // ── Title ────────────────────────────────────────────────────
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(91, 44, 131);
    pdf.text('Certificate of Completion', pw / 2, 46, { align: 'center' });

    // ── Subtitle line ────────────────────────────────────────────
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 100, 150);
    pdf.text('Intern 2 Expert — Professional Internship Program', pw / 2, 55, { align: 'center' });

    // ── Divider ──────────────────────────────────────────────────
    pdf.setDrawColor(180, 150, 220);
    pdf.setLineWidth(0.5);
    pdf.line(40, 60, pw - 40, 60);

    // ── "This is to certify that" ────────────────────────────────
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 60, 100);
    pdf.text('This is to certify that', pw / 2, 73, { align: 'center' });

    // ── Candidate Name ───────────────────────────────────────────
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 30, 100);
    pdf.text(cert.candidate_name, pw / 2, 86, { align: 'center' });

    // ── Name underline ───────────────────────────────────────────
    const nameWidth = pdf.getTextWidth(cert.candidate_name);
    pdf.setDrawColor(124, 58, 237);
    pdf.setLineWidth(0.8);
    pdf.line((pw - nameWidth) / 2, 88, (pw + nameWidth) / 2, 88);

    // ── College ──────────────────────────────────────────────────
    if (cert.college_name) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 80, 140);
      pdf.text(cert.college_name, pw / 2, 95, { align: 'center' });
    }

    // ── Body text ────────────────────────────────────────────────
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(70, 55, 90);
    const bodyLines = [
      `has successfully completed the Internship Program in`,
      cert.domain,
      `with a duration of ${cert.duration} month(s)`,
      `from ${this.formatDate(cert.start_date)} to ${this.formatDate(cert.end_date)}`,
    ];
    let y = 105;
    bodyLines.forEach((line, i) => {
      if (i === 1) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(91, 44, 131);
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(70, 55, 90);
      }
      pdf.text(line, pw / 2, y, { align: 'center' });
      y += 8;
    });

    // ── Achievement line ─────────────────────────────────────────
    y += 2;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(120, 100, 150);
    pdf.text(
      'This certificate is awarded in recognition of their dedication, commitment, and achievement.',
      pw / 2, y, { align: 'center' }
    );

    // ── Bottom divider ───────────────────────────────────────────
    y += 8;
    pdf.setDrawColor(180, 150, 220);
    pdf.setLineWidth(0.4);
    pdf.line(40, y, pw - 40, y);

    // ── Signatures ───────────────────────────────────────────────
    const sigY = ph - 34;
    pdf.setDrawColor(91, 44, 131);
    pdf.setLineWidth(0.6);

    // Left signature
    pdf.line(25, sigY, 85, sigY);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 40, 90);
    pdf.text('Authorized Signature', 55, sigY + 5, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(130, 110, 160);
    pdf.text('Crescent Technosoft', 55, sigY + 9, { align: 'center' });

    // Right signature
    pdf.line(pw - 85, sigY, pw - 25, sigY);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 40, 90);
    pdf.text('Director', pw - 55, sigY + 5, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(130, 110, 160);
    pdf.text('Intern 2 Expert', pw - 55, sigY + 9, { align: 'center' });

    // ── Certificate ID & Issue Date (bottom strip) ───────────────
    pdf.setFillColor(91, 44, 131);
    pdf.rect(12, ph - 18, pw - 24, 6, 'F');
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Certificate ID: ${cert.certificate_id}`, 18, ph - 14);
    pdf.text(`Issue Date: ${this.formatDate(cert.issue_date)}`, pw / 2, ph - 14, { align: 'center' });
    pdf.text('intern2expert.crescenttechnosoft.com', pw - 18, ph - 14, { align: 'right' });

    // ── QR Code ──────────────────────────────────────────────────
    try {
      const qrCanvas = await QRCode.toCanvas(
        `http://localhost:4200/verify-certificate/${cert.certificate_id}`,
        { width: 80, margin: 1 }
      );
      const qrImage = qrCanvas.toDataURL('image/png');
      const qrSize = 22;
      pdf.addImage(qrImage, 'PNG', pw / 2 - qrSize / 2, sigY - qrSize - 4, qrSize, qrSize);
    } catch (e) {
      console.warn('QR code failed:', e);
    }

    pdf.save(`Certificate_${cert.candidate_name.replace(/\s+/g, '_')}_${cert.certificate_id}.pdf`);
  }
}
