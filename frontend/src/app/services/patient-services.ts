import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = 'http://localhost:3000/patients';

  constructor(private http: HttpClient) {}

  createPatient(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updatePatient(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  getPatient(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


 getPatients(search: string = ''): Observable<any[]> {
  let params = new HttpParams();
  if (search) {
    params = params.set('search', search);
  }
  return this.http.get<any[]>(this.apiUrl, { params });
}

deletePatient(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}