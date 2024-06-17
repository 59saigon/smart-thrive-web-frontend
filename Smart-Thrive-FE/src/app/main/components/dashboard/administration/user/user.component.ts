import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../../data/entities/user';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getListUser();
    this.getSelectedColumns();
  }

  id: string = '';

  userDialog: boolean = false;

  deleteUserDialog: boolean = false;

  deleteUsersDialog: boolean = false;

  users: User[] = [];

  user: User = {} as User;

  location: Location = {} as Location;

  selectedUsers: User[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  showDetails = false;

  statuses: any[] = [];

  _selectedColumns: any[] = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  getListUser(): void {
    this.userService.getAllUser().subscribe({
      next: (response) => {
        this.users = response.results;
        console.log("check_", this.users[0].locationID);
      },
      error: (err) => {
      },
    });
  }
  getSelectedColumns() {
    this.cols = headerList;
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
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
