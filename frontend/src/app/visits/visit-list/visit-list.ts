import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { VisitService } from '../../services/visit-services';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { VisitForm } from '../visit-form/visit-form';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIcon,
    MatPaginatorModule
  ],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.scss'
})
export class VisitList implements OnInit {
  private visitService = inject(VisitService);

  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  totalLength = 0;
  
  visits$!: Observable<any[]>;
  displayedColumns: string[] = [
    'visitId',
    'firstName',
    'lastName',
    'visitDate',
    'visitType',
    'notes',
    'createdAt',
    'actions'
  ];

   constructor(
      private patientService: VisitService,
      private dialog: MatDialog 
    ) {}

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

    this.visits$.subscribe(data => {
      this.dataSource.data = data;
      this.totalLength = data.length;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
  
    const start = event.pageIndex * event.pageSize;
    const end = start + event.pageSize;
  
    this.visits$.subscribe(data => {
      this.dataSource.data = data.slice(start, end);
    });
  }
  
  
  onRowClick(visit: any): void {
    console.log('Visit clicked:', visit);
    console.log('Patient ID:', visit.patientId?._id || visit.patientId);
    console.log('Patient First Name:', visit.patientId?.firstName || '-');
    console.log('Patient Last Name:', visit.patientId?.lastName || '-');
  }

  editVisit(visit: any): void {
    console.log('Editing visit:', visit);
      this.dialog.open(VisitForm, {
        width: '500px',
        data: {
          id: visit._id,
          patient: visit.patientId 
        }
      });
    }

  openAddPatientDialog() {
      const dialogRef = this.dialog.open(VisitForm, {
        width: '500px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.visits$ = this.visitService.getAllVisits().pipe(
            tap(visits => {
              console.log('Visits after dialog close:', visits);
            })
          );
        }
      });
    }
  
}