import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { Category } from '../../../../../data/entities/category';
import { Course } from '../../../../../data/entities/course';
import { Subject } from '../../../../../data/entities/subject';
import { Provider } from '../../../../../data/entities/provider';
import { Location } from '../../../../../data/entities/location';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
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
  ngOnInit(): void {
    this.startDate = new Date(this.course.startDate ?? '');
    this.endDate = new Date(this.course.endDate ?? '');
    this.subject = this.course.subject ?? {} as Subject;
    this.provider = this.course.provider ?? {} as Provider;
    this.location = this.course.location ?? {} as Location;
    this.addressLocation = this.location?.ward + ', ' + this.location?.district + ', '
    + this.location?.city;
  }
}
