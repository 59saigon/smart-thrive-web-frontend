import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SubjectCreateOrUpdateComponent } from './subject-create-or-update/subject-create-or-update.component';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectService } from '../../../services/services/subject.service';
import { Subject } from '../../../../data/entities/subject';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SubjectComponent implements OnInit {
  @ViewChild(SubjectCreateOrUpdateComponent) subjectCreateOrUpdateComponent!: SubjectCreateOrUpdateComponent;
  @ViewChild(SubjectDetailComponent) subjectDetailComponent!: SubjectDetailComponent;

  constructor(
    private subjectService: SubjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.subjectService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.clear();
    this.getListSubject();
    this.getSelectedColumns();
  }

  clear() {
    this.subject = {} as Subject;
    this.subjects = [];
    this.selectedSubjects = [];
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

    this.getListSubject();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedSubjects() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected subjects?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedSubjects.forEach((m) => {
          this.subjectService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedSubjects = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Subjects Deleted', life: 3000 });
      }
    });
  }

  deleteSubject(subject: Subject) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + subject.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subjectService.delete(subject.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Subject Deleted', life: 3000 });
      }
    });
  }

  editSubject(subject: Subject) {
    this.subjectCreateOrUpdateComponent.subject = subject;
    this.subjectCreateOrUpdateComponent.ngOnInit();
    this.subjectCreateOrUpdateComponent.editSubject(subject);
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(subject: Subject) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.subjectDetailComponent.subject = subject;
    this.subjectDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) { }
}