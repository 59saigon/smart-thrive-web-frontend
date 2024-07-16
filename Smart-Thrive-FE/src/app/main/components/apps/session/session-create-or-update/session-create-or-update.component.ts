import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SessionComponent } from '../session.component';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Session } from '../../../../../data/entities/session';
import { SessionService } from '../../../../services/services/session.service';
import { Category } from '../../../../../data/entities/category';
import { Course } from '../../../../../data/entities/course';
import { CourseService } from '../../../../services/services/course.service';
import { Guid } from 'guid-typescript';
import { UserService } from '../../../../services/services/user.service';

@Component({
  selector: 'app-session-create-or-update',
  templateUrl: './session-create-or-update.component.html',
  styleUrl: './session-create-or-update.component.scss'
})
export class SessionCreateOrUpdateComponent implements OnInit {

  @Input() courseId!: Guid;

  session: Session = {} as Session;
  learnDate!: Date;

  sessionDialog: boolean = false;
  submitted: boolean = false;

  items!: SelectItem[];
  selectedItem!: SelectItem;
  courses: Course[] = [];

  constructor(private sessionService: SessionService,
    private messageService: MessageService,
    private courseService: CourseService,
    private userService: UserService,
    private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
    console.log("input", this.courseId);

    const isProvider = this.userService.getRole();
    !isProvider ? this.getCourses() : this.getCourseById();
  }

  getCourses() {
    this.courseService.getAll().subscribe({
      next: (response) => {
        this.courses = response.results;
        this.items = [];
        for (let i = 0; i < this.courses.length; i++) {
          this.items.push({ label: this.courses[i].courseName, value: this.courses[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
  }

  getCourseById() {
    this.courseService.getById(this.courseId).subscribe({
      next: (response) => {
        this.courses[0] = response.result;
        this.items = [];
        for (let i = 0; i < this.courses.length; i++) {
          this.items.push({ label: this.courses[i].courseName, value: this.courses[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
  }

  setTitleAndInformation() {
    if (this.session.id == null) {
      this.title = "New session";
      this.information = "Create new information session."
    } else {
      this.title = "Details session";
      this.information = "Update new information session."
      this.learnDate = new Date(this.session.learnDate ?? '');
      this.selectedItem = {} as SelectItem;
      this.selectedItem.value = this.session.course?.id;
      this.selectedItem.label = this.session.course?.courseName;
    }

  }

  openNew() {
    this.session = {} as Session;
    this.selectedItem = {} as SelectItem;
    this.sessionDialog = true;
    this.submitted = false;
    this.learnDate = new Date();
    const isProvider = this.userService.getRole() == 'Provider';
    !isProvider ? this.getCourses() : this.getCourseById();
  }

  hideDialog() {
    this.sessionDialog = false;
    this.submitted = false;
  }

  editSession() {
    this.sessionDialog = true;
    this.submitted = false;
  }

  saveSession() {
    this.submitted = true;
    this.session.learnDate = this.learnDate;
    this.session.courseId = this.selectedItem.value;

    if (this.session.id != null) {
      this.sessionService.update(this.session).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.sessionService.triggerRefresh();

        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.sessionService.add(this.session).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.sessionService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.sessionDialog = false;
  }
}


