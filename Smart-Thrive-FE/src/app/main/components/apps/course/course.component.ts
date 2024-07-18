import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
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
import Swal from 'sweetalert2';
import headerListAwaitingApproval from './headerListAwaitingApproval';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.courseService.refreshComponent$.subscribe(() => {
      this.initialize();
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
  awaitingActiveCourses: Course[] = [];
  approvedCourses: Course[] = [];
  activedCourses: Course[] = [];
  course: Course = {} as Course;
  selectedCourses: Course[] = [];

  submitted: boolean = false;
  cols: any[] = [];
  colsAwaiting: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];
  statuses: any[] = [];
  _selectedColumns: any[] = [];
  _selectedAwaitingColumns: any[] = [];
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
  @Input() get selectedAwaitingColumns(): any[] {
    return this._selectedAwaitingColumns;
  }

  set selectedAwaitingColumns(val: any[]) {
    this._selectedAwaitingColumns = this.cols.filter((col) => val.includes(col));
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

    this.courseService.getAllSearch(this.paginatedRequestFillter).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        console.log("pagina", this.paginatedListResponse)
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
        console.log("check_", response);
        this.awaitingCourses = response.results.filter(m => m.status == 'PENDING');
        console.log("check_awa", this.awaitingCourses);
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
      case 'NOT REQUEST':
        return 'secondary';
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
      this.colsAwaiting = headerListAwaitingApproval.filter((col) => col.field != 'provider'
        && col.field != 'isDeleted'
        && col.field != 'createdBy'
        && col.field != 'lastUpdatedBy'
      )
      this._selectedAwaitingColumns = this.colsAwaiting.filter((col) => !col.isDisabled);

      this.cols = headerList.filter((col) => col.field != 'provider'
        && col.field != 'isDeleted'
        && col.field != 'createdBy'
      )
      this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
    } else {
      this.cols = headerList;
      this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
    }

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
            this.activeState[1] = false;
            this.isShowDetail = false;
            this.awaitingCourses = [];
            this.courseDetailComponent.course = {} as Course;
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Course Deleted', life: 3000 });
      }
    });
  }

  getCourse(course: Course): Promise<Course> {
    return new Promise((resolve, reject) => {
      this.courseService.getById(course.id).subscribe({
        next: (response) => {
          resolve(response.result);
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err);
        }
      });
    });
  }

  requestPendingStatus(crs: Course) {

    this.getCourse(crs).then((course) => {
      var sessions = course.sessions?.filter(m => !m.isDeleted);
      var numberOfSessions = sessions?.length;
      Swal.fire({
        title: "Are you sure?",
        text: course.status + " -> " + "PENDING",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, let's request!"
      }).then((result) => {
        if (result.isConfirmed) {
          const numberOfSessionsInCourse = numberOfSessions ? numberOfSessions : 0;
          const totalSessionsInCourse = course.totalSessions ? course.totalSessions : 0;
          if (totalSessionsInCourse > numberOfSessionsInCourse) {
            Swal.fire({
              icon: "info",
              title: "Oops...",
              text: "Not enough session!"
            });
            return;
          }
          // update status
          course.status = "PENDING";
          this.courseService.update(course).subscribe({
            next: (response) => {
              this.activeIndex = 1;
              this.activeState[1] = false;
              this.isShowDetail = false;
              this.awaitingCourses = [];
              this.courseDetailComponent.course = {} as Course;
              Swal.fire({
                title: "Requested!",
                text: "Your data has been move to 'awaiting approval'.",
                icon: "success"
              });
              this.courseService.triggerRefresh();

            },
            error: (err) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            },
          });

        }
      });
    }).catch((err) => {
      console.error('Error fetching course:', err);
    });

  }

  requestActive(course: Course) {
    const inactive = course.isActive ? "Active" : "Inactive";
    Swal.fire({
      title: "Are you sure?",
      text: inactive + " -> " + "Active",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, let's request!"
    }).then((result) => {
      if (result.isConfirmed) {
        // update status
        course.isActive = true;
        this.courseService.update(course).subscribe({
          next: (response) => {
            this.activeIndex = 0;
            Swal.fire({
              title: "Requested!",
              text: "Your course has been actived.",
              icon: "success"
            });
            this.courseService.triggerRefresh();

          },
          error: (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          },
        });

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

  onGlobalFilter(table: Table, event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.paginatedRequestFillter = this.paginatedRequest;
    this.paginatedRequestFillter.result = {} as Course;
    this.paginatedRequestFillter.result.code = value;
    this.paginatedRequestFillter.result.id = Guid.parse(value);
    this.paginatedRequestFillter.result.status = value;
    this.paginatedRequestFillter.result.courseName = value;

    this.courseService.getAllSearch(this.paginatedRequestFillter).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        console.log("pagina", this.paginatedListResponse)
        this.setPaginatedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

}