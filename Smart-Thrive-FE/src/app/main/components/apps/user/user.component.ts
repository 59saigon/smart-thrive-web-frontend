import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../../../data/entities/user';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';
import { UserService } from '../../../services/services/user.service';
import { UserCreateOrUpdateComponent } from './user-create-or-update/user-create-or-update.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit {
  @ViewChild(UserCreateOrUpdateComponent) userCreateOrUpdateComponent!: UserCreateOrUpdateComponent;
  @ViewChild(UserDetailComponent) userDetailComponent!: UserDetailComponent;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.userService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.clear();
    this.getListUser();
    this.getSelectedColumns();
  }

  clear() {
    this.user = {} as User;
    this.users = [];
    this.selectedUsers = [];
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

  paginatedListResponse: PaginatedListResponse<User> = {} as PaginatedListResponse<User>;
  getListUser(): void {
    this.userService.getAllPagination(this.paginatedRequest).subscribe({
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

    this.getListUser();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedUsers.forEach((m) => {
          this.userService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedUsers = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
      }
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.email + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(user.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
      }
    });
  }

  editUser(user: User) {
    this.userCreateOrUpdateComponent.user = user;
    this.userCreateOrUpdateComponent.ngOnInit();
    this.userCreateOrUpdateComponent.editUser(user);
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(user: User) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.userDetailComponent.user = user;
    this.userDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) { }
}