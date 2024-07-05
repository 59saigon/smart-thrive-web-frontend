import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { Event } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  
  constructor(private studentService: StudentService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getListStudent();
    this.getSelectedColumns();
    this.student.user?.email
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
  showDetails = false;
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
    sortOrder: 1
  };
  paginatedListResponse: PaginatedListResponse<Student> = {} as PaginatedListResponse<Student>;
  getListStudent(): void {
    this.studentService.getAllPagination(this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        console.log("check_student", this.paginatedListResponse.results);
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
    this.paginatedRequest.pageNumber = event.first/event.rows + 1;
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
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Copied'});
  }

  openNew() {

  }

  deleteSelectedStudents() {
  }

  deleteStudent(student: Student) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editStudent(student: Student) {
  }

  saveStudent() {

  }

  hideDialog() {

  }

  navigateAfterSelected(student: Student) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
