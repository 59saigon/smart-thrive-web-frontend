import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SessionCreateOrUpdateComponent } from './session-create-or-update/session-create-or-update.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { SessionService } from '../../../services/services/session.service';
import { Session } from '../../../../data/entities/session';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SessionComponent implements OnInit {
  @ViewChild(SessionCreateOrUpdateComponent) sessionCreateOrUpdateComponent!: SessionCreateOrUpdateComponent;
  @ViewChild(SessionDetailComponent) sessionDetailComponent!: SessionDetailComponent;

  constructor(
    private sessionService: SessionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.sessionService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.clear();
    this.getListSession();
    this.getSelectedColumns();
  }

  clear() {
    this.session = {} as Session;
    this.sessions = [];
    this.selectedSessions = [];
  }

  sessionDialog: boolean = false;
  deleteSessionDialog: boolean = false;
  deleteSessionsDialog: boolean = false;

  sessions: Session[] = [];
  session: Session = {} as Session;
  selectedSessions: Session[] = [];

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

  paginatedListResponse: PaginatedListResponse<Session> = {} as PaginatedListResponse<Session>;
  getListSession(): void {
    this.sessionService.getAllPagination(this.paginatedRequest).subscribe({
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

    this.getListSession();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedSessions() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected sessions?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedSessions.forEach((m) => {
          this.sessionService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedSessions = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Sessions Deleted', life: 3000 });
      }
    });
  }

  deleteSession(session: Session) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + session.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sessionService.delete(session.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Session Deleted', life: 3000 });
      }
    });
  }

  editSession(session: Session) {
    this.sessionCreateOrUpdateComponent.session = session;
    this.sessionCreateOrUpdateComponent.ngOnInit();
    this.sessionCreateOrUpdateComponent.editSession(session);
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(session: Session) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.sessionDetailComponent.session = session;
    this.sessionDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) { }
}