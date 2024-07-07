import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectComponent } from '../subject.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Subject } from '../../../../../data/entities/subject';
import { SubjectService } from '../../../../services/services/subject.service';
import { Category } from '../../../../../data/entities/category';

@Component({
  selector: 'app-subject-create-or-update',
  templateUrl: './subject-create-or-update.component.html',
  styleUrl: './subject-create-or-update.component.scss'
})
export class SubjectCreateOrUpdateComponent implements OnInit {

  subject: Subject = {} as Subject;
  category: Category = {} as Category;
  genderOther!: string;
  selectedGender!: string;
  confirmPassword!: string;

  subjectDialog: boolean = false;
  submitted: boolean = false;



  constructor(private subjectService: SubjectService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
  }

  setTitleAndInformation() {
    if (this.subject.id == null) {
      this.title = "New subject";
      this.information = "Create new information subject."
      this.selectedGender = 'Female';
    } else {
      this.title = "Details subject";
      this.information = "Update new information subject."
    }

  }

  openNew() {
    this.subject = {} as Subject;
    this.subjectDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.subjectDialog = false;
    this.submitted = false;
  }

  editSubject(subject: Subject) {
    this.subject = { ...subject };
    this.subjectDialog = true;
    this.submitted = false;
  }

  saveSubject() {
    this.submitted = true;

    if (this.subject.id != null) {
      this.subjectService.update(this.subject).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.subjectService.triggerRefresh();
          
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.subjectService.add(this.subject).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.subjectService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.subjectDialog = false;
  }
}


