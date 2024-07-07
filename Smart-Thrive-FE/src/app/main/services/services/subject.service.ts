import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Subject } from '../../../data/entities/subject';
import { HttpClient } from '@angular/common/http';
import { Subject as RxSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService extends BaseService<Subject>{

  private refreshComponent = new RxSubject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }

  constructor(public _http: HttpClient) {
    super(_http, 'subject')
  }
}
