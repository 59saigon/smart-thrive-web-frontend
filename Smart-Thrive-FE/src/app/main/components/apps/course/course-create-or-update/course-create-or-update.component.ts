import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseComponent } from '../course.component';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Course } from '../../../../../data/entities/course';
import { CourseService } from '../../../../services/services/course.service';
import { Category } from '../../../../../data/entities/category';
import { Subject } from '../../../../../data/entities/subject';
import { Provider } from '../../../../../data/entities/provider';
import { SubjectService } from '../../../../services/services/subject.service';
import { ProviderService } from '../../../../services/services/provider.service';
import { UserService } from '../../../../services/services/user.service';
import { Guid } from 'guid-typescript';

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

  items!: SelectItem[];
  items2!: SelectItem[];
  items3!: SelectItem[];
  selectedItem!: SelectItem;
  selectedItem2!: SelectItem;
  selectedItem3!: SelectItem;
  providers: Provider[] = [];
  subjects: Subject[] = [];

  constructor(private courseService: CourseService,
    private subjectService: SubjectService,
    private providerService: ProviderService,
    protected userService: UserService,
    private messageService: MessageService,
    private confirm: ConfirmationService) {
  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();

    this.getListSubject();
    this.getListProvider();
  }

  getListSubject() {
    this.subjectService.getAll().subscribe({
      next: (response) => {
        this.subjects = response.results;
        this.items = [];
        for (let i = 0; i < this.subjects.length; i++) {
          this.items.push({ label: this.subjects[i].subjectName, value: this.subjects[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
  }

  getListProvider() {
    this.providerService.getAll().subscribe({
      next: (response) => {
        this.providers = response.results;
        this.items2 = [];
        for (let i = 0; i < this.providers.length; i++) {
          this.items2.push({ label: this.providers[i].companyName, value: this.providers[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
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
      this.selectedItem = {} as SelectItem;
      this.selectedItem.value = this.course.subject?.id;
      this.selectedItem.label = this.course.subject?.subjectName;

      this.selectedItem2 = {} as SelectItem;
      this.selectedItem2.value = this.course.provider?.id;
      this.selectedItem2.label = this.course.provider?.companyName;
    }

  }

  openNew() {
    this.course = {} as Course;
    
    this.selectedItem = {} as SelectItem;
    this.selectedItem2 = {} as SelectItem;
    this.selectedItem3 = {} as SelectItem;
    this.courseDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.courseDialog = false;
    this.submitted = false;
  }

  editCourse() {
    this.courseDialog = true;
    this.submitted = false;
  }

  findProviderByProviderId(providerId: Guid): Provider | undefined {
    this.getListProvider();
    return this.providers.find(provider => provider.id === providerId);
  }

  saveCourse() {
    this.submitted = true;

    this.course.soldCourses = 0;
    this.course.startDate = this.startDate;
    this.course.endDate = this.endDate;
    this.course.subjectId = this.selectedItem.value;

    if(this.userService.getRole() === 'Provider') {
      this.course.isActive = false;
      this.course.isApproved = false;
      this.course.providerId = this.findProviderByProviderId(this.userService.getUserDetails().provider?.id!)?.id;
    } else {
      this.course.providerId =this.selectedItem2.value;
    }

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


