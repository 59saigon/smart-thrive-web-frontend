import { Injectable } from '@angular/core';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { BaseResponse, ItemResponse } from '../../../data/model/base-response';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../data/model/paginated-response';
import { Course } from '../../../data/entities/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(public http: HttpClient) {
  }

  addCourse(pack: Course): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${ConstantsApi.course.baseUrl}${ConstantsApi.add}`, pack);
  }

  updateCourse(pack: Course): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${ConstantsApi.course.baseUrl}${ConstantsApi.update}`, pack);
  }

  deleteCourse(courseId: Guid): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${ConstantsApi.course.baseUrl}${ConstantsApi.delete}/${courseId}`);
  }

  getAllCourse(request: PaginatedRequest): Observable<PaginatedListResponse<Course>> {
    return this.http.post<PaginatedListResponse<Course>>(`${ConstantsApi.course.baseUrl}${ConstantsApi.getAll}`, request);
  }

  getAllCourseSearch(request: PaginatedRequestFillter<Course>): Observable<PaginatedListResponse<Course>> {
    return this.http.post<PaginatedListResponse<Course>>(`${ConstantsApi.course.baseUrl}${ConstantsApi.getAllSearch}`, request);
  }

  getById(id: Guid): Observable<ItemResponse<Course>> {
    return this.http.get<ItemResponse<Course>>(`${ConstantsApi.course.baseUrl}${ConstantsApi.getById}/${id}`);
  }

}
