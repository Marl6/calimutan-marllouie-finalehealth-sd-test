import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient-services';
import { Observable, Subject, debounceTime } from 'rxjs';
import { DatePipe, NgIf, AsyncPipe } from '@angular/common';
import { MatTableModule, MatTableDataSource  } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PatientForm } from '../patient-form/patient-form';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Summary } from '../../summary/summary';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    MatTableModule,
    AsyncPipe,
    FormsModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss'
})
export class PatientList implements OnInit {
  isLoading: boolean = true;
  searchChanged: Subject<string> = new Subject<string>();
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 5;
  totalLength = 0;
  search: string = '';
  patients$!: Observable<any[]>;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'dob',
    'email',
    'phoneNumber',
    'address',
    'totalVisits',
    'actions'
  ];

  onSearch() {
    this.searchChanged.next(this.search);
  }

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog 
  ) {}

  ngOnInit() {
    this.isLoading = true;
  
    this.searchChanged.pipe(
      debounceTime(1000)
    ).subscribe((searchTerm: string) => {
      this.isLoading = true;
      this.patientService.getPatients(searchTerm).subscribe(data => {
        this.dataSource.data = data;
        this.totalLength = data.length;
        this.isLoading = false;
      });
    });
  
    this.patients$ = this.patientService.getPatients();
  
    this.patients$.subscribe(data => {
      this.dataSource.data = data;
      this.totalLength = data.length;
      this.isLoading = false;
    });
  }
  

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
  
    const start = event.pageIndex * event.pageSize;
    const end = start + event.pageSize;
  
    this.patients$.subscribe(data => {
      this.dataSource.data = data.slice(start, end);
    });
  }
  

  clearSearch() { 
    this.search = '';
    this.onSearch();
  }

  openAddPatientDialog() {
    const dialogRef = this.dialog.open(PatientForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSearch();
      }
    });
  }

  editPatient(patient: any): void {
    this.dialog.open(PatientForm, {
      width: '500px',
      data: { id: patient._id }
    });
  }

  deletePatient(patient: any) {
    const id = patient._id;
    const fullName = `${patient.firstName} ${patient.lastName}`;
  
    if (!id) {
      console.error('Patient ID is missing:', patient);
      return;
    }
  
    if (confirm(`Are you sure you want to delete ${fullName}?`)) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          this.onSearch();        },
        error: err => alert('Delete failed: ' + (err.error?.message || err.message))
      });
    }
  }

  onRowClick(patient: any): void {
    console.log('Patient row object:', patient);
  }

  viewPatientSummary(patient: any): void {
    this.dialog.open(Summary, {
      width: '800px',
      data: { patient }
    });
  }
}