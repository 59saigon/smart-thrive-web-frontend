import { Injectable } from '@angular/core';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Package } from '../../../data/entities/package';
import { Guid } from 'guid-typescript';
import { BaseResponse, ItemResponse } from '../../../data/model/base-response';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../data/model/paginated-response';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  constructor(public http: HttpClient) {
  }

  addPackage(pack: Package): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${ConstantsApi.package.baseUrl}${ConstantsApi.add}`, pack);
  }

  updatePackage(pack: Package): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${ConstantsApi.package.baseUrl}${ConstantsApi.update}`, pack);
  }

  deletePackage(packageId: Guid): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${ConstantsApi.package.baseUrl}${ConstantsApi.delete}/${packageId}`);
  }

  getAllPackage(request: PaginatedRequest): Observable<PaginatedListResponse<Package>> {
    return this.http.post<PaginatedListResponse<Package>>(`${ConstantsApi.package.baseUrl}${ConstantsApi.getAll}`, request);
  }

  getAllPackageSearch(request: PaginatedRequestFillter<Package>): Observable<PaginatedListResponse<Package>> {
    return this.http.post<PaginatedListResponse<Package>>(`${ConstantsApi.package.baseUrl}${ConstantsApi.getAllSearch}`, request);
  }

  getById(id: Guid): Observable<ItemResponse<Package>> {
    return this.http.get<ItemResponse<Package>>(`${ConstantsApi.package.baseUrl}${ConstantsApi.getById}/${id}`);
  }

}
