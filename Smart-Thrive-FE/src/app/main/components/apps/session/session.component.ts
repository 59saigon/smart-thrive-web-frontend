import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { Event } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Session } from '../../../../data/entities/session';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';
import { SessionService } from '../../../services/services/session.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SessionComponent implements OnInit {
  
  constructor(private sessionService: SessionService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getListSession();
    this.getSelectedColumns();
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

  showDetails = false;

  statuses: any[] = [];

  _selectedColumns: any[] = [];

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

    this.getListSession();
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

  deleteSelectedSessions() {
  }

  deleteSession(session: Session) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editSession(session: Session) {
  }

  saveSession() {

  }

  hideDialog() {

  }

  navigateAfterSelected(session: Session) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
