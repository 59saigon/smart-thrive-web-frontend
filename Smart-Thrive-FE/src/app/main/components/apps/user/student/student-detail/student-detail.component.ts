import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Student } from '../../../../../../data/entities/student';
import { PaginatedRequest } from '../../../../../../data/model/paginated-request';
import { User } from '../../../../../../data/entities/user';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  id: string | null = null;
  student: Student = {} as Student;
  user: User = {} as User;
  dob!: Date;
  genderOther!: string;
  selectedGender!: string;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };

  ngOnInit(): void {
    this.dob = new Date(this.student.dob ?? '');
    if (this.student.gender != 'Female' && this.student.gender != 'Male') {
      this.selectedGender = 'Other';
      this.genderOther = this.student.gender || '';
    } else {
      this.selectedGender = this.student.gender || '';
    }

    this.user = this.student.user || {} as User;
  }
}
