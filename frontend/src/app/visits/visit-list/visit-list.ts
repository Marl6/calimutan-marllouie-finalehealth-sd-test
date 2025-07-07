import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { VisitService } from '../../services/visit-services';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.scss'
})
export class VisitList implements OnInit {
  private visitService = inject(VisitService);
  
  visits$!: Observable<any[]>;
  displayedColumns: string[] = [
    'visitId',
    'firstName',
    'lastName',
    'visitDate',
    'visitType',
    'createdAt'
  ];

  ngOnInit(): void {
    this.visits$ = this.visitService.getAllVisits().pipe(
      tap(visits => {
        console.log('Raw visits data:', visits);
        if (visits.length > 0) {
          console.log('First visit structure:', JSON.stringify(visits[0], null, 2));
          console.log('PatientId type:', typeof visits[0].patientId);
          console.log('PatientId value:', visits[0].patientId);
        }
      })
    );
  }
  
  onRowClick(visit: any): void {
    console.log('Visit clicked:', visit);
    console.log('Patient ID:', visit.patientId?._id || visit.patientId);
    console.log('Patient First Name:', visit.patientId?.firstName || '-');
    console.log('Patient Last Name:', visit.patientId?.lastName || '-');
  }
}