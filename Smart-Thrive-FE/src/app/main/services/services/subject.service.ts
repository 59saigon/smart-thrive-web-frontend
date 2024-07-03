import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Subject } from '../../../data/entities/subject';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubjectService extends BaseService<Subject>{

  constructor(public _http: HttpClient) {
    super(_http, 'subject')
  }
}
