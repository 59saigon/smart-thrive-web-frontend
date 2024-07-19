import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StudentCreateOrUpdateComponent } from './student-create-or-update/student-create-or-update.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { Student } from '../../../../../data/entities/student';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../../data/model/paginated-response';
import { StudentService } from '../../../../services/services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StudentComponent implements OnInit {
  @ViewChild(StudentCreateOrUpdateComponent) studentCreateOrUpdateComponent!: StudentCreateOrUpdateComponent;
  @ViewChild(StudentDetailComponent) studentDetailComponent!: StudentDetailComponent;

  constructor(
    private studentService: StudentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.studentService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.clear();
    this.getListStudent();
    this.getSelectedColumns();
  }

  clear() {
    this.student = {} as Student;
    this.students = [];
    this.selectedStudents = [];
  }

  studentDialog: boolean = false;
  deleteStudentDialog: boolean = false;
  deleteStudentsDialog: boolean = false;

  students: Student[] = [];
  student: Student = {} as Student;
  selectedStudents: Student[] = [];

  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];
  statuses: any[] = [];
  _selectedColumns: any[] = [];
  activeState: boolean[] = [true, false, false];

  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: -1
  };

  paginatedListResponse: PaginatedListResponse<Student> = {} as PaginatedListResponse<Student>;
  getListStudent(): void {
    this.studentService.getAllPagination(this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        this.setPaginatedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }
  getSelectedColumns() {
    this.cols = headerList;
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
  }

  loadPatientListing(event: any) {
    this.paginatedRequest.pageSize = event.rows;
    this.paginatedRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedRequest.sortField = event.sortField;
    this.paginatedRequest.sortOrder = event.sortOrder;

    this.getListStudent();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedStudents() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected students?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedStudents.forEach((m) => {
          this.studentService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedStudents = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Students Deleted', life: 3000 });
      }
    });
  }

  deleteStudent(student: Student) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + student.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentService.delete(student.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
      }
    });
  }

  editStudent(student: Student) {
    this.studentCreateOrUpdateComponent.student = student;
    this.studentCreateOrUpdateComponent.ngOnInit();
    this.studentCreateOrUpdateComponent.editStudent();
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(student: Student) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.studentDetailComponent.student = student;
    this.studentDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) { }
}