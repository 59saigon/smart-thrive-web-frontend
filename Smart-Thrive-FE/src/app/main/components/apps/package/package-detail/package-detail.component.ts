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

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.scss'
})
export class PackageDetailComponent implements OnInit {
  constructor(private messageService: MessageService
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
  courseXPackage: CourseXPackage[] = [];
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


  ngOnInit(): void {
    this.startDate = new Date(this.package.startDate ?? '');
    this.endDate = new Date(this.package.endDate ?? '');
    this.student = this.package.student ?? {} as Student;
    this.getListCourse().then(() => {
      this.paginatedListResponse.results = this.courses || [];
      this.getSelectedColumns();
      console.log(this.paginatedListResponse.results);
    });
  }

  async getListCourse(): Promise<void> {
    // get list guid courseIds
    this.courseXPackage = [];
    this.courseIds = [];
    this.courseXPackage = this.package.courseXPackages ?? [];
    for(let i: number = 0; i < this.courseXPackage.length; i++) {
      const courseId = this.courseXPackage[i].courseId;
      if (courseId) {
        this.courseIds.push(courseId as unknown as Guid);
      }
    }

    this.paginatedRequestFillter.result = this.courseIds;
    console.log(this.paginatedRequestFillter.result);

    return new Promise((resolve, reject) => {
      this.courseService.getAllPaginationByListId(this.paginatedRequestFillter).subscribe({
        next: (response) => {
          this.courses = response.results || [];
          console.log(response.results);
          this.courseXPackage = [];
          this.paginatedRequestFillter.result = [];
          resolve();
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err);
        }
      });
    });
  }

  deleteCourse(course: Course) {
  }

  deleteSelectedCourses() {
    throw new Error('Method not implemented.');
  }
  openNew() {
    throw new Error('Method not implemented.');
  }

  getSelectedColumns() {
    this.cols = headerListCourse;
    this._selectedColumns = this.cols;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }
}
