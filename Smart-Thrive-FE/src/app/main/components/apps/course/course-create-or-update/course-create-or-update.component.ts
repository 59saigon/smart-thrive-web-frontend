import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseComponent } from '../course.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Course } from '../../../../../data/entities/course';
import { CourseService } from '../../../../services/services/course.service';
import { Category } from '../../../../../data/entities/category';
import { Subject } from '../../../../../data/entities/subject';
import { Provider } from '../../../../../data/entities/provider';

@Component({
  selector: 'app-course-create-or-update',
  templateUrl: './course-create-or-update.component.html',
  styleUrl: './course-create-or-update.component.scss'
})
export class CourseCreateOrUpdateComponent implements OnInit {

  course: Course = {} as Course;
  subject: Subject = {} as Subject;
  provider: Provider = {} as Provider;
  location: Location = {} as Location;
  startDate!: Date;
  endDate!: Date;

  courseDialog: boolean = false;
  submitted: boolean = false;



  constructor(private courseService: CourseService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
  }

  setTitleAndInformation() {
    if (this.course.id == null) {
      this.title = "New course";
      this.information = "Create new information course."
    } else {
      this.title = "Details course";
      this.information = "Update new information course."
      this.startDate = new Date(this.course.startDate ?? '');
      this.endDate = new Date(this.course.endDate ?? '');
    }

  }

  openNew() {
    this.course = {} as Course;
    this.courseDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.courseDialog = false;
    this.submitted = false;
  }

  editCourse(course: Course) {
    this.course = { ...course };
    this.courseDialog = true;
    this.submitted = false;
  }

  saveCourse() {
    this.submitted = true;

    this.course.startDate = this.startDate;
    this.course.endDate = this.endDate;

    if (this.course.id != null) {
      this.courseService.update(this.course).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.courseService.triggerRefresh();
          
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.courseService.add(this.course).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.courseService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.courseDialog = false;
  }
}


