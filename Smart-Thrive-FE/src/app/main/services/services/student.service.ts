import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Student } from '../../../data/entities/student';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends BaseService<Student> {

  constructor(public _http: HttpClient) {
    super(_http, 'student')
  }
}
