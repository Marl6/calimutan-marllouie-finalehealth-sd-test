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
  isLoading: boolean = true;
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
  this.isLoading = true;

  this.visits$ = this.visitService.getAllVisits().pipe(
    tap(visits => {
      this.dataSource.data = visits;
      this.totalLength = visits.length;
      this.isLoading = false; 
    })
  );

  this.visits$.subscribe();
}

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
  
    const start = event.pageIndex * event.pageSize;
    const end = start + event.pageSize;
  
    this.visits$.subscribe(data => {
      this.dataSource.data = data.slice(start, end);
    });
  }

  openEditVisitDialog(visit: any): void {
     const dialogRef = this.dialog.open(VisitForm, {
        width: '500px',
        data: {
          id: visit._id,
          patient: visit.patientId 
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.visits$ = this.visitService.getAllVisits().pipe();
          this.visits$.subscribe(data => {
            this.dataSource.data = data;
            this.totalLength = data.length;
          });
        }
      });
    }

  openAddVisitDialog() {
      const dialogRef = this.dialog.open(VisitForm, {
        width: '500px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.visits$ = this.visitService.getAllVisits().pipe();
        }
      });
    }
  
}