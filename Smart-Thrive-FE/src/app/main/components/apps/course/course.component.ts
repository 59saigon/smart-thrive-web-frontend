import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import headerList from './headerList';
import { MessageService } from 'primeng/api';
import { Course } from '../../../../data/entities/course';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';
import { CourseService } from '../../../services/user/course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CourseComponent {
  constructor(private courseService: CourseService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getListCourse();
    this.getSelectedColumns();
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

  showDetails = false;

  statuses: any[] = [];

  _selectedColumns: any[] = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  paginatedRequest: PaginatedRequest = {
    pageNumber: 0,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };
  paginatedListResponse: PaginatedListResponse<Course> = {} as PaginatedListResponse<Course>;
  getListCourse(): void {
    this.courseService.getAllCourse(this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        console.log("check_", this.paginatedListResponse.results);
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
    this.paginatedRequest.pageNumber = event.first/event.rows + 1;
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
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Copied'});
  }

  openNew() {

  }

  deleteSelectedCourses() {
  }

  deleteCourse(course: Course) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editCourse(course: Course) {
  }

  saveCourse() {

  }

  hideDialog() {

  }

  navigateAfterSelected(course: Course) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
