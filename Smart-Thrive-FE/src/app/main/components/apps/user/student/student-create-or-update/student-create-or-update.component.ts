import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentComponent } from '../student.component';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Student } from '../../../../../../data/entities/student';
import { StudentService } from '../../../../../services/services/student.service';
import { UserService } from '../../../../../services/services/user.service';
import { User } from '../../../../../../data/entities/user';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-student-create-or-update',
  templateUrl: './student-create-or-update.component.html',
  styleUrl: './student-create-or-update.component.scss'
})
export class StudentCreateOrUpdateComponent implements OnInit {

  student: Student = {} as Student;
  genderOther!: string;
  selectedGender!: string;
  confirmPassword!: string;
  dob!: Date;

  studentDialog: boolean = false;
  submitted: boolean = false;

  items!: SelectItem[];
  selectedItem!: SelectItem;
  users: User[] = [];

  constructor(private studentService: StudentService,
    private messageService: MessageService,
    private confirm: ConfirmationService,
    private userService: UserService
  ) {

  }

  title!: string;
  information!: string;

  

  ngOnInit(): void {
    this.setTitleAndInformation();

    this.userService.getAll().subscribe({
      next: (response) => {
        this.users = response.results;
        this.items = [];
        for (let i = 0; i < this.users.length; i++) {
          this.items.push({ label: this.users[i].email, value: this.users[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
  }

  setTitleAndInformation() {
    if (this.student.id == null) {
      this.title = "New student";
      this.information = "Create new information student."
      this.selectedGender = 'Female';
    } else {
      this.title = "Details student";
      this.information = "Update new information student."
      this.dob = new Date(this.student.dob ?? '');
      if (this.student.gender != 'Female' && this.student.gender != 'Male') {
        this.selectedGender = 'Other';
        this.genderOther = this.student.gender || '';
      } else {
        this.selectedGender = this.student.gender || '';
      }
      this.selectedItem = {} as SelectItem;
      this.selectedItem.value = this.student.user?.id;
      this.selectedItem.label = this.student.user?.email;
    }
  }

  openNew() {
    this.student = {} as Student;
    this.selectedItem = {} as SelectItem;
    this.selectedGender = 'Female';
    this.studentDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.studentDialog = false;
    this.submitted = false;
  }

  editStudent() {
    this.studentDialog = true;
    this.submitted = false;
  }

  saveStudent() {

    if (this.genderOther) {
      this.student.gender = this.genderOther;
    } else {
      this.student.gender = this.selectedGender;
    }

    this.student.userId = this.selectedItem.value;

    this.submitted = true;

    if (this.student.id != null) {
      this.studentService.update(this.student).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.studentService.triggerRefresh();

        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.studentService.add(this.student).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.studentService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.studentDialog = false;
  }
}


