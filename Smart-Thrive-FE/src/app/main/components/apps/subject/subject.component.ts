import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { Event } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from '../../../../data/entities/subject';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';
import { SubjectService } from '../../../services/services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SubjectComponent implements OnInit {
  
  constructor(private subjectService: SubjectService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getListSubject();
    this.getSelectedColumns();
  }

  subjectDialog: boolean = false;
  deleteSubjectDialog: boolean = false;
  deleteSubjectsDialog: boolean = false;

  subjects: Subject[] = [];
  subject: Subject = {} as Subject;
  selectedSubjects: Subject[] = [];

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
  paginatedListResponse: PaginatedListResponse<Subject> = {} as PaginatedListResponse<Subject>;
  getListSubject(): void {
    this.subjectService.getAllPagination(this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        console.log("check_", this.paginatedListResponse.results);
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

    this.getListSubject();
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

  deleteSelectedSubjects() {
  }

  deleteSubject(subject: Subject) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editSubject(subject: Subject) {
  }

  saveSubject() {

  }

  hideDialog() {

  }

  navigateAfterSelected(subject: Subject) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
