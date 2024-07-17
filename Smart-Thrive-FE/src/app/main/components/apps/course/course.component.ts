import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CourseCreateOrUpdateComponent } from './course-create-or-update/course-create-or-update.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseService } from '../../../services/services/course.service';
import { Course } from '../../../../data/entities/course';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';
import { UserService } from '../../../services/services/user.service';
import { Guid } from 'guid-typescript';
import { SessionService } from '../../../services/services/session.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CourseComponent implements OnInit {
  @ViewChild(CourseCreateOrUpdateComponent) courseCreateOrUpdateComponent!: CourseCreateOrUpdateComponent;
  @ViewChild(CourseDetailComponent) courseDetailComponent!: CourseDetailComponent;

  constructor(
    private courseService: CourseService,
    protected userService: UserService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.courseService.refreshComponent$.subscribe(() => {
      this.initialize();
      this.activeIndex = 1;
    });
  }

  initialize(): void {
    this.clear();
    const isProvider = this.userService.getRole() === "Provider";
    if (!isProvider) {
      this.getListCourse()
    } else {
      this.getListCourseNoPaginationByProviderId();
      this.getListCourseByProviderId();
    }
    
    this.getSelectedColumns();
  }

  clear() {
    this.course = {} as Course;
    this.courses = [];
    this.selectedCourses = [];
  }

  courseDialog: boolean = false;
  deleteCourseDialog: boolean = false;
  deleteCoursesDialog: boolean = false;

  courses: Course[] = [];
  awaitingCourses: Course[] = [];
  course: Course = {} as Course;
  selectedCourses: Course[] = [];

  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];
  statuses: any[] = [];
  _selectedColumns: any[] = [];
  activeState: boolean[] = [true, false, false];
  activeIndex: number = 0;

  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: -1
  };

  courseRequestFilter: Course = {} as Course;
  paginatedRequestFillter: PaginatedRequestFillter<Course> = {
    pageNumber: this.paginatedRequest.pageNumber,
    pageSize: this.paginatedRequest.pageSize,
    sortField: this.paginatedRequest.sortField,
    sortOrder: this.paginatedRequest.sortOrder,
    result: this.courseRequestFilter
  }

  paginatedListResponse: PaginatedListResponse<Course> = {} as PaginatedListResponse<Course>;
  getListCourse(): void {
    this.paginatedRequestFillter = this.paginatedRequest;
    this.paginatedRequestFillter.result = {} as Course;
    this.paginatedRequestFillter.result.status = 'APPROVED';
    this.courseService.getAllSearch(this.paginatedRequestFillter).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        console.log("pagina",this.paginatedListResponse)
        this.setPaginatedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  getListCourseNoPaginationByProviderId(): void {
    this.courseService.getAllByProviderId(this.userService.getUserDetails().provider?.id!).subscribe({
      next: (response) => {
        this.awaitingCourses = response.results.filter(m => m.status == 'PENDING' || m.status == 'REJECT');
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }



  getListCourseByProviderId(): void {
    this.courseService.getAllPaginationByProviderId(this.userService.getUserDetails().provider?.id!, this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
      },
      error: (err) => {
        console.log("check_error", err);
      },
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

    return 'secondary'
  }
  getValueBool(status: boolean) {
    switch (status) {
      case true:
        return 'Active';
      case false:
        return 'Inactive';
    }
  }

  getSeverityBool(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'secondary';
    }
  }

  getSelectedColumns() {
    const isProvider = this.userService.getRole() === "Provider";
    if (isProvider) {
      this.cols = headerList.filter((col) => col.field != 'provider'
        && col.field != 'isDeleted'
        && col.field != 'createdBy'
        && col.field != 'lastUpdatedBy'
      )
    } else {
      this.cols = headerList;
    }
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
  }

  loadPatientListing(event: any) {
    this.paginatedRequest.pageSize = event.rows;
    this.paginatedRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedRequest.sortField = event.sortField;
    this.paginatedRequest.sortOrder = event.sortOrder;

    const isProvider = this.userService.getRole() === "Provider";
    !isProvider ? this.getListCourse() : this.getListCourseByProviderId();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedCourses() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected courses?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedCourses.forEach((m) => {
          this.courseService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedCourses = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Courses Deleted', life: 3000 });
      }
    });
  }

  deleteCourse(course: Course) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + course.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.courseService.delete(course.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Course Deleted', life: 3000 });
      }
    });
  }

  editCourse(course: Course) {
    this.courseCreateOrUpdateComponent.course = course;
    this.courseCreateOrUpdateComponent.ngOnInit();
    this.courseCreateOrUpdateComponent.editCourse();
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(course: Course) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.courseDetailComponent.course = course;
    this.courseDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) { }
}