import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from '../../../../../data/entities/subject';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { Category } from '../../../../../data/entities/category';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrl: './subject-detail.component.scss'
})
export class SubjectDetailComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  id: string | null = null;
  subject: Subject = {} as Subject;
  category: Category = {} as Category;
  dob!: Date;
  genderOther!: string;
  selectedGender!: string;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };

  ngOnInit(): void {
    this.category = this.subject.category || {} as Category;
  }
}
