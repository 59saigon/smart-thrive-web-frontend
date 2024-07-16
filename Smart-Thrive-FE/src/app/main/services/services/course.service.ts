import { Injectable } from '@angular/core';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { BaseResponse, ItemResponse } from '../../../data/model/base-response';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../data/model/paginated-response';
import { Course } from '../../../data/entities/course';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService extends BaseService<Course> {

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }

  constructor(public _http: HttpClient) {
    super(_http, 'course')
  }

  getAllPaginationByListId(request: PaginatedRequestFillter<Guid[]>): Observable<PaginatedListResponse<Course>> {
    return this.http.post<PaginatedListResponse<Course>>(`${this.getBaseUrl()}${ConstantsApi.getAllPaginationByListId}`, request);
  }

  getAllPaginationByProviderId(providerId: Guid,request: PaginatedRequest): Observable<PaginatedListResponse<Course>> {
    return this.http.post<PaginatedListResponse<Course>>(`${this.getBaseUrl()}/get-all-pagination-by-provider-id?providerId=${providerId}`, request);
  }
}
