import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Package } from '../../../../../data/entities/package';
import { PackageService } from '../../../../services/services/package.service';
import { Student } from '../../../../../data/entities/student';

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

  packageDialog: boolean = false;
  submitted: boolean = false;



  constructor(private packageService: PackageService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
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
    }

  }

  openNew() {
    this.package = {} as Package;
    this.packageDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.packageDialog = false;
    this.submitted = false;
  }

  editPackage(pkg: Package) {
    this.package = { ...pkg };
    this.packageDialog = true;
    this.submitted = false;
  }

  savePackage() {
    this.submitted = true;

    this.package.startDate = this.startDate;
    this.package.endDate = this.endDate;

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


