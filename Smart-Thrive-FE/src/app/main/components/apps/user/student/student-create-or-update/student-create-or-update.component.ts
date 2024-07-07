import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentComponent } from '../student.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Student } from '../../../../../../data/entities/student';
import { StudentService } from '../../../../../services/services/student.service';

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

  studentDialog: boolean = false;
  submitted: boolean = false;



  constructor(private studentService: StudentService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
  }

  setTitleAndInformation() {
    if (this.student.id == null) {
      this.title = "New student";
      this.information = "Create new information student."
      this.selectedGender = 'Female';
    } else {
      this.title = "Details student";
      this.information = "Update new information student."
      this.student.dob = new Date(this.student.dob ?? '');
      if (this.student.gender != 'Female' && this.student.gender != 'Male') {
        this.selectedGender = 'Other';
        this.genderOther = this.student.gender || '';
      } else {
        this.selectedGender = this.student.gender || '';
      }
    }

  }

  openNew() {
    this.student = {} as Student;
    this.studentDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.studentDialog = false;
    this.submitted = false;
  }

  editStudent(student: Student) {
    this.student = { ...student };
    this.studentDialog = true;
    this.submitted = false;
  }

  saveStudent() {

    if (this.genderOther) {
      this.student.gender = this.genderOther;
    } else {
      this.student.gender = this.selectedGender;
    }

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


