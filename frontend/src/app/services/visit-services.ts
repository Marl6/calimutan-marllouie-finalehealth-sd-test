import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private baseUrl = 'http://localhost:3000/visits';

  constructor(private http: HttpClient) {}

  createVisit(patientId: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/patients/${patientId}/visits`, data);
  }

  getAllVisits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getVisitsByPatientId(patientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patients/${patientId}/visits`);
  }

  getVisitById(visitId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${visitId}`);
  }

  updateVisit(visitId: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${visitId}`, data);
  }

  deleteVisit(visitId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${visitId}`);
  }
}