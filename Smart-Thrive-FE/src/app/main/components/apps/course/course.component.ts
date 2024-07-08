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
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';

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
    });
  }

  initialize(): void {
    this.clear();
    this.getListCourse();
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
  course: Course = {} as Course;
  selectedCourses: Course[] = [];

  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];
  statuses: any[] = [];
  _selectedColumns: any[] = [];
  activeState: boolean[] = [true, false, false];

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
    sortOrder: 1
  };

  paginatedListResponse: PaginatedListResponse<Course> = {} as PaginatedListResponse<Course>;
  getListCourse(): void {
    this.courseService.getAllPagination(this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        this.setPaginatedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }
  getSelectedColumns() {
    this.cols = headerList;
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
  }

  loadPatientListing(event: any) {
    this.paginatedRequest.pageSize = event.rows;
    this.paginatedRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedRequest.sortField = event.sortField;
    this.paginatedRequest.sortOrder = event.sortOrder;

    this.getListCourse();
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