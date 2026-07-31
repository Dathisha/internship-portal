import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly apiUrl = `${environment.apiUrl}/certificates`;
  private readonly candidatesUrl = `${environment.apiUrl}/approved-candidates`;

  constructor(private http: HttpClient) { }

  getApprovedCandidates(): Observable<any[]> {
    return this.http.get<any[]>(this.candidatesUrl);
  }

  saveCertificate(certificateData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, certificateData);
  }

  checkDuplicateCertificate(internshipApplicationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check/${internshipApplicationId}`);
  }

  verifyCertificate(certificateId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verify/${certificateId}`);
  }

  generateCertificate(certificateId: string, duration?: number): Observable<any> {
    const cleanId = encodeURIComponent(certificateId.trim());
    const durationParam = duration && duration > 0 ? `?duration=${duration}` : '';
    return this.http.get<any>(`${this.apiUrl}/generate/${cleanId}${durationParam}`);
  }

  sendCertificateEmail(certificateId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-email`, { certificate_id: certificateId });
  }
}
