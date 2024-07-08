import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Package } from '../../../../../data/entities/package';
import { PackageService } from '../../../../services/services/package.service';
import { Student } from '../../../../../data/entities/student';
import { StudentService } from '../../../../services/services/student.service';

@Component({
  selector: 'app-package-create-or-update',
  templateUrl: './package-create-or-update.component.html',
  styleUrl: './package-create-or-update.component.scss'
})
export class PackageCreateOrUpdateComponent implements OnInit {

  package: Package = {} as Package;
  student: Student = {} as Student;
  startDate!: Date;
  endDate!: Date;

  items!: SelectItem[];
  selectedItem!: SelectItem;
  students: Student[] = [];

  packageDialog: boolean = false;
  submitted: boolean = false;

  constructor(private packageService: PackageService,
     private messageService: MessageService,
     private studentService: StudentService,
      private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
    this.getListStudent();
  }

  getListStudent() {
    this.studentService.getAll().subscribe({
      next: (response) => {
        this.students = response.results;
        this.items = [];
        for (let i = 0; i < this.students.length; i++) {
          this.items.push({ label: this.students[i].studentName, value: this.students[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
  }

  setTitleAndInformation() {
    if (this.package.id == null) {
      this.title = "New package";
      this.information = "Create new information package."
    } else {
      this.title = "Details package";
      this.information = "Update new information package."
      this.startDate = new Date(this.package.startDate ?? '');
      this.endDate = new Date(this.package.endDate ?? '');

      this.selectedItem = {} as SelectItem;
      this.selectedItem.value = this.package.student?.id;
      this.selectedItem.label = this.package.student?.studentName;
    }

  }

  openNew() {
    this.package = {} as Package;
    this.selectedItem = {} as SelectItem;
    this.packageDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.packageDialog = false;
    this.submitted = false;
  }

  editPackage() {
    this.packageDialog = true;
    this.submitted = false;
  }

  savePackage() {
    this.submitted = true;

    this.package.startDate = this.startDate;
    this.package.endDate = this.endDate;
    this.package.studentId = this.selectedItem.value;

    if (this.package.id != null) {
      this.packageService.update(this.package).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.packageService.triggerRefresh();

        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.packageService.add(this.package).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.packageService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.packageDialog = false;
  }
}


