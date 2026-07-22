import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InternshipApplicationResponse } from '../models/internship-application.model';

@Injectable({ providedIn: 'root' })
export class InternshipApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/internship-applications`;

  constructor(private http: HttpClient) {}

  submitApplication(formData: FormData): Observable<InternshipApplicationResponse> {
    return this.http.post<InternshipApplicationResponse>(this.apiUrl, formData);
  }
}
