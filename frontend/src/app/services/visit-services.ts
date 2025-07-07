import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Create a new visit for a patient
  createVisit(patientId: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/visits/patients/${patientId}/visits`, data);
  }

  // Get all visits
  getAllVisits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/visits`);
  }

  // Get all visits by patient ID
  getVisitsByPatientId(patientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/visits/patients/${patientId}/visits`);
  }

  // Get a specific visit by visit ID
  getVisitById(visitId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/visits/${visitId}`);
  }

  // Update a visit
  updateVisit(visitId: string, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/visits/${visitId}`, data);
  }

  // Delete a visit
  deleteVisit(visitId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/visits/${visitId}`);
  }
}