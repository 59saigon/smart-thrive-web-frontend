import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { Category } from '../../../../../data/entities/category';
import { Course } from '../../../../../data/entities/course';
import { Subject } from '../../../../../data/entities/subject';
import { Provider } from '../../../../../data/entities/provider';
import { Session } from '../../../../../data/entities/session';
import { PaginatedListResponse } from '../../../../../data/model/paginated-response';
import headerListSession from './headerListSession';
import { Guid } from 'guid-typescript';
import { SessionService } from '../../../../services/services/session.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  constructor(private messageService: MessageService, private sessionService: SessionService) { }

  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];

  sessions: Session[] = [];
  selectedSessions: Session[] = [];

  _selectedColumns: any[] = [];
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  id: string | null = null;
  course: Course = {} as Course;
  subject: Subject = {} as Subject;
  provider: Provider = {} as Provider;
  location: Location = {} as Location;
  startDate!: Date;
  endDate!: Date;
  genderOther!: string;
  selectedGender!: string;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };

  addressLocation!: string;
  paginatedListResponse: PaginatedListResponse<Session> = {} as PaginatedListResponse<Session>;

  ngOnInit() {
    this.initialize();
    this.getSelectedColumns();

    // set get sessions by provider id

    this.sessionService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize() {
    this.startDate = new Date(this.course.startDate ?? '');
    this.endDate = new Date(this.course.endDate ?? '');
    this.subject = this.course.subject ?? {} as Subject;
    this.provider = this.course.provider ?? {} as Provider;
    this.getListSessionByCourseId(this.course.id);
  }


  getListSessionByCourseId(providerId: Guid) {
    this.sessionService.getAllByCourseId(providerId).subscribe({
      next: (response) => {
        this.paginatedListResponse.results = response.results;
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  deleteSession(session: Session) {
  }

  deleteSelectedSessions() {
    throw new Error('Method not implemented.');
  }
  openNew() {
    throw new Error('Method not implemented.');
  }

  getSelectedColumns() {
    this.cols = headerListSession;
    this._selectedColumns = this.cols;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }
}
