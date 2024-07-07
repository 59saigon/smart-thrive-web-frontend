import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Package } from '../../../../../data/entities/package';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { Category } from '../../../../../data/entities/category';
import { Course } from '../../../../../data/entities/course';
import { Student } from '../../../../../data/entities/student';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.scss'
})
export class PackageDetailComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  id: string | null = null;
  package: Package = {} as Package;
  student: Student = {} as Student;
  startDate!: Date;
  endDate!: Date;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };

  ngOnInit(): void {
    this.startDate = new Date(this.package.startDate ?? '');
    this.endDate = new Date(this.package.endDate ?? '');
    this.student = this.package.student ?? {} as Student;
  }
}
