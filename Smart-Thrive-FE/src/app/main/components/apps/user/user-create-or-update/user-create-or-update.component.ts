import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../../../data/entities/user';
import { UserService } from '../../../../services/services/user.service';
import { UserComponent } from '../user.component';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Role } from '../../../../../data/entities/role';
import { RoleService } from '../../../../services/services/role.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-user-create-or-update',
  templateUrl: './user-create-or-update.component.html',
  styleUrl: './user-create-or-update.component.scss'
})
export class UserCreateOrUpdateComponent implements OnInit {

  user: User = {} as User;
  genderOther!: string;
  selectedGender!: string;
  confirmPassword!: string;

  userDialog: boolean = false;
  submitted: boolean = false;
  items!: SelectItem[];
  selectedItem!: SelectItem;



  constructor(private userService: UserService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;
  roleName!: string;
  roles: Role[] = [];

  ngOnInit(): void {
    this.setTitleAndInformation();
    this.getListRole();
  }

  getListRole(): void {
    this.roleService.getAll().subscribe({
      next: (response) => {
        this.roles = response.results;
        this.items = [];
        for (let i = 0; i < this.roles.length; i++) {
          this.items.push({ label: this.roles[i].roleName, value: this.roles[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  setTitleAndInformation() {
    if (this.user.id == null) {
      this.title = "New user";
      this.information = "Create new information user."
      this.selectedGender = 'Female';
    } else {
      this.title = "Details user";
      this.information = "Update new information user."
      this.user.dob = new Date(this.user.dob);

      this.selectedItem = {} as SelectItem;
      this.selectedItem.value = this.user.role?.id;
      this.selectedItem.label = this.user.role?.roleName;

      if (this.user.gender != 'Female' && this.user.gender != 'Male') {
        this.selectedGender = 'Other';
        this.genderOther = this.user.gender || '';
      } else {
        this.selectedGender = this.user.gender || '';
      }
    }

  }

  openNew() {
    this.user = {} as User;
    this.userDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
    this.submitted = false;
  }

  async saveUser() {

    this.user.fullName = this.user.firstName + " " + this.user.lastName;
    this.user.roleId = this.selectedItem.value;

    if (this.genderOther) {
      this.user.gender = this.genderOther;
    } else {
      this.user.gender = this.selectedGender;
    }

    this.submitted = true;

    if (this.user.id != null) {
      this.userService.update(this.user).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.userService.triggerRefresh();

        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.userService.register(this.user).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.userService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.userDialog = false;
  }

  role: Role = {} as Role;
  getRoleByName(roleName: string): Promise<Guid> {
    return new Promise((resolve, reject) => {
      this.roleService.getByRoleName(roleName).subscribe({
        next: (response) => {
          this.role = response.result;
          resolve(this.role.id);
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err);
        }
      });
    });
  }
}


