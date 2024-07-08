import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectComponent } from '../subject.component';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Subject } from '../../../../../data/entities/subject';
import { SubjectService } from '../../../../services/services/subject.service';
import { Category } from '../../../../../data/entities/category';
import { CategoryService } from '../../../../services/services/category.service';
import { Guid } from 'guid-typescript';

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

  items!: SelectItem[];
  selectedItem!: SelectItem;
  categories: Category[] = [];

  subjectDialog: boolean = false;
  submitted: boolean = false;

  constructor(private subjectService: SubjectService,
    private messageService: MessageService,
    private confirm: ConfirmationService,
    private categoryService: CategoryService
  ) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();

    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response.results;
        this.items = [];
        for (let i = 0; i < this.categories.length; i++) {
          this.items.push({ label: this.categories[i].categoryName, value: this.categories[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
  }

  setTitleAndInformation() {
    if (this.subject.id == null) {
      this.title = "New subject";
      this.information = "Create new information subject."
      this.selectedGender = 'Female';
    } else {
      this.title = "Details subject";
      this.information = "Update new information subject.";
      this.selectedItem = {} as SelectItem;
      this.selectedItem.value = this.subject.category?.id;
      this.selectedItem.label = this.subject.category?.categoryName;
    }

  }

  openNew() {
    this.subject = {} as Subject;
    this.selectedItem = {} as SelectItem;
    this.subjectDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.subjectDialog = false;
    this.submitted = false;
  }

  editSubject() {
    this.subjectDialog = true;
    this.submitted = false;
  }

  saveSubject() {
    this.submitted = true;

    this.subject.categoryId = this.selectedItem.value;

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


