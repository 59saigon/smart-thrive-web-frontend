import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../../../data/entities/user';
import { UserService } from '../../../../services/services/user.service';
import { UserComponent } from '../user.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-create-or-update',
  templateUrl: './user-create-or-update.component.html',
  styleUrl: './user-create-or-update.component.scss'
})
export class UserCreateOrUpdateComponent implements OnInit {

  @ViewChild(UserComponent) userComponent!: UserComponent;
  user: User = {} as User;
  genderOther!: string;
  selectedGender!: string;
  confirmPassword!: string;

  userDialog: boolean = false;
  submitted: boolean = false;



  constructor(private userService: UserService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
    
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

  saveUser() {

    this.user.fullName = this.user.firstName + " " + this.user.lastName;

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
      this.userService.add(this.user).subscribe({
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
}


