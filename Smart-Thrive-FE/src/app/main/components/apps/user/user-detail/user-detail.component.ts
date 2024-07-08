import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../../../../data/entities/student';
import { PaginatedListResponse } from '../../../../../data/model/paginated-response';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { MessageService } from 'primeng/api';
import { User } from '../../../../../data/entities/user';
import headerListStudent from './headerListStudent';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];

  students: Student[] = [];
  selectedStudents: Student[] = [];

  constructor(private messageService: MessageService) { }

  _selectedColumns: any[] = [];
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedStudents() {
    throw new Error('Method not implemented.');
  }
  openNew() {
    throw new Error('Method not implemented.');
  }
  id: string | null = null;
  user: User = {} as User;
  dob!: Date;
  genderOther!: string;
  selectedGender!: string;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };

  deleteStudent(student: Student) {
  }

  paginatedListResponse: PaginatedListResponse<Student> = {} as PaginatedListResponse<Student>;
  ngOnInit(): void {
    this.getList();
    console.log("check_user2", this.user);
    this.getSelectedColumns();

    this.dob = new Date(this.user.dob);
    if (this.user.gender != 'Female' && this.user.gender != 'Male') {
      this.selectedGender = 'Other';
      this.genderOther = this.user.gender || '';
    } else {
      this.selectedGender = this.user.gender || '';
    }
  }
  getList() {
    this.paginatedListResponse.results = this.user.students || [];
  }

  getSelectedColumns() {
    this.cols = headerListStudent;
    this._selectedColumns = this.cols;
  }
}