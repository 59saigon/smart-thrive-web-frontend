import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Session } from '../../../../../data/entities/session';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { Category } from '../../../../../data/entities/category';
import { Course } from '../../../../../data/entities/course';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.scss'
})
export class SessionDetailComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  id: string | null = null;
  session: Session = {} as Session;
  course: Course = {} as Course;
  learnDate!: Date;
  genderOther!: string;
  selectedGender!: string;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };

  ngOnInit(): void {
    this.learnDate = new Date(this.session.learnDate ?? '');
    this.course = this.session.course ?? {} as Course;
  }
}
