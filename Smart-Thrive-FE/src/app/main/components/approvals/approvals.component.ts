import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Course } from '../../../data/entities/course';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../data/model/paginated-response';
import { CourseService } from '../../services/services/course.service';
import { SessionService } from '../../services/services/session.service';
import { UserService } from '../../services/services/user.service';
import headerList from './headerList';
import Swal from 'sweetalert2';
import headerListApprovedAndRejectCourse from './headerListApprovedAndRejectCourse';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrl: './approvals.component.scss'
})
export class ApprovalsComponent implements OnInit {
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
    console.log("checks", this.awaitingCourses);
    this.isShowDetail = false;

    this.courseService.refreshComponent$.subscribe(() => {
      this.initialize();

    });
  }

  initialize(): void {
    this.getPendingListCourse();
    this.getApprovedListCourse();
    this.getRejectListCourse();
    this.getSelectedColumns();
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
  _selectedApprovedColumns: any[] = [];
  _selectedRejectedColumns: any[] = [];
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

  @Input() get selectedApprovedColumn(): any[] {
    return this._selectedApprovedColumns;
  }

  set selectedApprovedColumn(val: any[]) {
    this._selectedApprovedColumns = this.colsApproved.filter((col) => val.includes(col));
  }

  @Input() get selectedRejectedColumns(): any[] {
    return this._selectedRejectedColumns;
  }

  set selectedRejectedColumns(val: any[]) {
    this._selectedRejectedColumns = this.colsRejected.filter((col) => val.includes(col));
  }

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: -1
  };
  paginatedApprovedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'LastUpdatedDate',
    sortOrder: -1
  };
  paginatedRejectRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'LastUpdatedDate',
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

  paginatedPendingListResponse: PaginatedListResponse<Course> = {} as PaginatedListResponse<Course>;
  getPendingListCourse(): void {
    this.paginatedRequestFillter = {} as PaginatedRequestFillter<Course>;

    this.paginatedRequestFillter = this.paginatedRequest;
    this.paginatedRequestFillter.result = {} as Course;
    this.paginatedRequestFillter.result.status = 'PENDING';
    this.courseService.getAllSearch(this.paginatedRequestFillter).subscribe({
      next: (response) => {
        this.paginatedPendingListResponse = response;
        console.log("check_p", response)
        //this.setPaginatedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  paginatedApprovedListResponse: PaginatedListResponse<Course> = {} as PaginatedListResponse<Course>;
  getApprovedListCourse(): void {
    this.paginatedRequestFillter = {} as PaginatedRequestFillter<Course>;
    this.paginatedRequestFillter = this.paginatedApprovedRequest;
    this.paginatedRequestFillter.result = {} as Course;
    this.paginatedRequestFillter.result.status = 'APPROVED';
    this.courseService.getAllSearch(this.paginatedRequestFillter).subscribe({
      next: (response) => {
        this.paginatedApprovedListResponse = response;
        //this.setPaginatedApprovedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  paginatedRejectListResponse: PaginatedListResponse<Course> = {} as PaginatedListResponse<Course>;
  getRejectListCourse(): void {
    this.paginatedRequestFillter = {} as PaginatedRequestFillter<Course>;

    this.paginatedRequestFillter = this.paginatedRejectRequest;
    this.paginatedRequestFillter.result = {} as Course;
    this.paginatedRequestFillter.result.status = 'REJECTED';
    this.courseService.getAllSearch(this.paginatedRequestFillter).subscribe({
      next: (response) => {
        this.paginatedRejectListResponse = response;
        //this.setPaginatedRejectRequest();
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
  colsApproved: any[] = [];
  colsRejected: any[] = [];
  getSelectedColumns() {
    this.cols = headerList;
    this.colsApproved = headerListApprovedAndRejectCourse;
    this.colsRejected = headerListApprovedAndRejectCourse;
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
    this._selectedApprovedColumns = this.colsApproved.filter((col) => !col.isDisabled);
    this._selectedRejectedColumns = this.colsRejected.filter((col) => !col.isDisabled);
  }

  loadPatientListing(event: any) {
    this.paginatedRequest.pageSize = event.rows;
    this.paginatedRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedRequest.sortField = event.sortField;
    this.paginatedRequest.sortOrder = event.sortOrder;

    this.getPendingListCourse();
  }
  loadPatientApprovedListing(event: any) {
    this.paginatedApprovedRequest.pageSize = event.rows;
    this.paginatedApprovedRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedApprovedRequest.sortField = event.sortField;
    this.paginatedApprovedRequest.sortOrder = event.sortOrder;

    this.getApprovedListCourse();
  }
  loadPatientRejectListing(event: any) {
    this.paginatedRejectRequest.pageSize = event.rows;
    this.paginatedRejectRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedRejectRequest.sortField = event.sortField;
    this.paginatedRejectRequest.sortOrder = event.sortOrder;

    this.getRejectListCourse();
  }


  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }


  deleteCourse(course: Course) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject this course!"
    }).then((result) => {
      if (result.isConfirmed) {
        // update status
        course.status = 'REJECTED';
        this.courseService.update(course).subscribe({
          next: (response) => {
            this.activeIndex = 2;
            Swal.fire({
              title: "Rejected!",
              text: "Your data has been move to reject.",
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve this course!"
    }).then((result) => {
      if (result.isConfirmed) {
        // update status
        course.status = 'APPROVED';
        this.courseService.update(course).subscribe({
          next: (response) => {
            this.activeIndex = 1;
            Swal.fire({
              title: "Approved!",
              text: "Your data has been move to approved.",
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

  isShowDetail: boolean = false;
  navigateAfterSelected(course: Course) {
  }

  onGlobalFilter(table: Table, event: Event) { }
}
