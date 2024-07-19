import { Injectable } from '@angular/core';
import { Session } from '../../../data/entities/session';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Observable, Subject } from 'rxjs';
import { Guid } from 'guid-typescript';
import { Course } from '../../../data/entities/course';
import { PaginatedRequest } from '../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../data/model/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService<Session>{

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }
  
  constructor(public _http: HttpClient) {
    super(_http, 'session')
  }

  getAllByCourseId(courseId: Guid): Observable<PaginatedListResponse<Session>> {
    return this.http.get<PaginatedListResponse<Session>>(`${this.getBaseUrl()}/get-all-by-course-id/${courseId}`, {
      headers: this.getHeaders()
    });
  }


  getAllByCourseIdForProvider(courseId: Guid): Observable<PaginatedListResponse<Session>> {
    return this.http.get<PaginatedListResponse<Session>>(`${this.getBaseUrl()}/get-all-by-course-id-for-provider/${courseId}`, {
      headers: this.getHeaders()
    });
  }
}
