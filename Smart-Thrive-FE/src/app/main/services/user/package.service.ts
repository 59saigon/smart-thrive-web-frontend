import { Injectable } from '@angular/core';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Package } from '../../../data/entities/package';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  constructor(public http: HttpClient) {
  }

  // addPackage(object: Package): Observable<BaseResponseBool> {
  //   return this.http.post<BaseResponseBool>(`${ConstantsApi.package.baseUrl}${ConstantsApi.package.addPackage}`, object);
  // }

  // updatePackage(object: Package): Observable<BaseResponseBool> {
  //   return this.http.put<BaseResponseBool>(`${ConstantsApi.package.baseUrl}${ConstantsApi.package.updatePackage}`, object);
  // }

  // deletePackage(id: number): Observable<BaseResponseBool> {
  //   return this.http.delete<BaseResponseBool>(`${ConstantsApi.package.baseUrl}${ConstantsApi.package.deletePackage}/${id}`);
  // }

  // getAllPackage(): Observable<BaseResponseList<Package>> {
  //   return this.http.get<BaseResponseList<Package>>(`${ConstantsApi.package.baseUrl}${ConstantsApi.package.getAllPackage}`);
  // }

}
