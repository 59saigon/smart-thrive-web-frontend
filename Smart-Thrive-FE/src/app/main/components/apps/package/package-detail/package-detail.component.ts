import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Package } from '../../../../../data/entities/package';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../../../data/model/paginated-request';
import { Course } from '../../../../../data/entities/course';
import { Student } from '../../../../../data/entities/student';
import headerListCourse from './headerListCourse';
import { PaginatedListResponse } from '../../../../../data/model/paginated-response';
import { CourseService } from '../../../../services/services/course.service';
import { Guid } from 'guid-typescript';
import { CourseXPackage } from '../../../../../data/entities/courseXpackage';
import { Table } from 'primeng/table';
import { UserService } from '../../../../services/services/user.service';
import { CourseXPackageService } from '../../../../services/services/courexpackage.service';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.scss'
})
export class PackageDetailComponent implements OnInit {
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal(
      (event.target as HTMLInputElement).value,
      'contains'
    );
  }
  constructor(private messageService: MessageService,
    protected userService: UserService,
    private courseXpackageService: CourseXPackageService
    , private courseService: CourseService
  ) { }

  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];

  courses: Course[] = [];
  selectedCourses: Course[] = [];

  _selectedColumns: any[] = [];
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }
  paginatedListResponse: PaginatedListResponse<Course> = {} as PaginatedListResponse<Course>;

  id: string | null = null;
  package: Package = {} as Package;
  student: Student = {} as Student;
  courseXPackages: CourseXPackage[] = [];
  courseIds: Guid[] = [];
  startDate!: Date;
  endDate!: Date;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };
  paginatedRequestFillter: PaginatedRequestFillter<Guid[]> = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedBy',
    sortOrder: 1
  };

  coursesExceptListId: Course[] = [];
  ngOnInit(): void {
    this.initialize();

    this.courseXpackageService.refreshComponent$.subscribe(() => {
      this.initialize();
    });

  }

  loadPatientListing(event: any) {
    this.paginatedRequest.pageSize = event.rows;
    this.paginatedRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedRequest.sortField = event.sortField;
    this.paginatedRequest.sortOrder = event.sortOrder;

    this.getAllCourseXPackageByPackageId().then(() => {
      this.getCoursesBasedOnCourseXPackage();
    });
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  initialize() {
    this.startDate = new Date(this.package.startDate ?? '');
    this.endDate = new Date(this.package.endDate ?? '');
    this.student = this.package.student ?? {} as Student;

    this.getAllCourseXPackageByPackageId().then(() => {
      this.getCoursesExceptListId();
    });


    this.getAllCourseXPackageByPackageId().then(() => {
      this.getCoursesBasedOnCourseXPackage().then(() => {
        this.getSelectedColumns();
      });
    });



  }

  async getCoursesBasedOnCourseXPackage(): Promise<void> {
    // get list guid courseIds
    this.courseIds = [];

    for (let i: number = 0; i < this.courseXPackages.length; i++) {
      const courseId = this.courseXPackages[i].courseId;
      if (courseId) {
        this.courseIds.push(courseId as unknown as Guid);
      }
    }
    this.paginatedRequestFillter = this.paginatedRequest;
    this.paginatedRequestFillter.result = this.courseIds;

    return new Promise((resolve, reject) => {
      this.courseService.getAllPaginationByListId(this.paginatedRequestFillter).subscribe({
        next: (response) => {
          this.courses = response.results || [];
          this.courseXPackages = [];
          this.paginatedListResponse = response;
          this.setPaginatedRequest();
          resolve();
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err);
        }
      });
    });
  }

  async getCoursesExceptListId(): Promise<void> {

    this.courseIds = [];
    this.coursesExceptListId = [];

    for (let i: number = 0; i < this.courseXPackages.length; i++) {
      const courseId = this.courseXPackages[i].courseId;
      if (courseId) {
        this.courseIds.push(courseId as unknown as Guid);
      }
    }

    console.log("check_courseId-list", this.courseIds)


    this.paginatedRequestFillter.result = this.courseIds;

    return new Promise((resolve, reject) => {
      this.courseService.getAllExceptListId(this.paginatedRequestFillter).subscribe({
        next: (response) => {
          this.coursesExceptListId = response.results || [];
          resolve();
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err);
        }
      });
    });
  }

  async getAllCourseXPackageByPackageId(): Promise<void> {
    this.courseXPackages = [];
    return new Promise((resolve, reject) => {
      this.courseXpackageService.getAllByPackageId(this.package.id).subscribe({
        next: (response) => {
          this.courseXPackages = response.results || [];
          console.log("check_courseXPackage", this.courseXPackages);
          resolve();
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err);
        }
      });
    });

  }

  coursexpackage: CourseXPackage = {} as CourseXPackage;
  addCourseIntoPackage(course: Course) {
    this.coursexpackage.courseId = course.id;
    this.coursexpackage.packageId = this.package.id;
    this.courseXpackageService.add(this.coursexpackage).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.courseXpackageService.triggerRefresh();
        //this.courseService.triggerRefresh();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
      },
    });
  }

  dialogVisible: boolean = false;

  openNew() {
    this.getAllCourseXPackageByPackageId().then(() => {
      this.getCoursesExceptListId().then(() => {
        this.dialogVisible = true;
      });
    });
  }

  deleteCourse(course: Course) {

  }

  getSelectedColumns() {
    this.cols = headerListCourse;
    this._selectedColumns = this.cols;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
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
}
