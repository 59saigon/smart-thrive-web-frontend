import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { Event } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from '../../../../data/entities/user';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';
import { UserService } from '../../../services/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit {
  
  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getListUser();
    this.getSelectedColumns();
  }

  userDialog: boolean = false;

  deleteUserDialog: boolean = false;

  deleteUsersDialog: boolean = false;

  users: User[] = [];

  user: User = {} as User;

  selectedUsers: User[] = [];

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
  paginatedListResponse: PaginatedListResponse<User> = {} as PaginatedListResponse<User>;
  getListUser(): void {
    this.userService.getAll(this.paginatedRequest).subscribe({
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

    this.getListUser();
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

  deleteSelectedUsers() {
  }

  deleteUser(user: User) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editUser(user: User) {
  }

  saveUser() {

  }

  hideDialog() {

  }

  navigateAfterSelected(user: User) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
