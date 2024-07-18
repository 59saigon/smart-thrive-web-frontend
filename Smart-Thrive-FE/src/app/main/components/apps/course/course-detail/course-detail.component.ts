import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { UserService } from '../../../../services/services/user.service';
import { SessionCreateOrUpdateComponent } from '../../session/session-create-or-update/session-create-or-update.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  @ViewChild(SessionCreateOrUpdateComponent) sessionCreateOrUpdateComponent!: SessionCreateOrUpdateComponent;

  constructor(private messageService: MessageService, private userService: UserService, private sessionService: SessionService, private confirmationService: ConfirmationService) { }

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
  getSeverity(status: string) {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
    }

    return 'secondary';
  }
  initialize() {
    this.startDate = new Date(this.course.startDate ?? '');
    this.endDate = new Date(this.course.endDate ?? '');
    this.subject = this.course.subject ?? {} as Subject;
    this.provider = this.course.provider ?? {} as Provider;
    const isProvider = this.userService.getRole();
    !isProvider ? this.getListSessionByCourseId(this.course.id) : this.getListSessionByCourseIdForProvider(this.course.id);
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
  
  getListSessionByCourseIdForProvider(providerId: Guid) {
    this.sessionService.getAllByCourseIdForProvider(providerId).subscribe({
      next: (response) => {
        this.paginatedListResponse.results = response.results;
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  deleteSession(session: Session) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + session.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sessionService.delete(session.id).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your data has been changed.",
              icon: "success"
            });
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        
      }
    });
  }

  editSession(session: Session) {
    this.sessionCreateOrUpdateComponent.session = session;
    this.sessionCreateOrUpdateComponent.ngOnInit();
    this.sessionCreateOrUpdateComponent.editSession();
  }

  deleteSelectedSessions() {
    throw new Error('Method not implemented.');
  }
  openNew() {
    throw new Error('Method not implemented.');
  }

  getSelectedColumns() {
    const isProvider = this.userService.getRole() === "Provider";
    if (isProvider) {
      this.cols = headerListSession.filter((col) => col.field != 'provider'
        && col.field != 'isDeleted'
        && col.field != 'createdBy'
        && col.field != 'lastUpdatedBy'
      )
    } else {
      this.cols = headerListSession;
    }
    this._selectedColumns = this.cols;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }
}
