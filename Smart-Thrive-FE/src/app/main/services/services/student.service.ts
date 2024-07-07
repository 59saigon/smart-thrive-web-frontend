import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Student } from '../../../data/entities/student';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends BaseService<Student> {

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }
  
  constructor(public _http: HttpClient) {
    super(_http, 'student')
  }
}
