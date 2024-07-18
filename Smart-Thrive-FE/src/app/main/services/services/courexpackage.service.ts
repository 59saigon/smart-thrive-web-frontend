import { Injectable } from '@angular/core';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { BaseResponse, ItemListResponse, ItemResponse } from '../../../data/model/base-response';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../data/model/paginated-response';
import { Course } from '../../../data/entities/course';
import { BaseService } from '../base/base.service';
import { CourseXPackage } from '../../../data/entities/courseXpackage';

@Injectable({
  providedIn: 'root',
})
export class CourseXPackageService extends BaseService<CourseXPackage> {

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }

  constructor(public _http: HttpClient) {
    super(_http, 'coursexpackage')
  }

  getAllByPackageId(packageId: Guid): Observable<ItemListResponse<CourseXPackage>> {
    return this.http.get<ItemListResponse<CourseXPackage>>(`${this.getBaseUrl()}/get-all-by-package-id/${packageId}`);
  }

  
}
