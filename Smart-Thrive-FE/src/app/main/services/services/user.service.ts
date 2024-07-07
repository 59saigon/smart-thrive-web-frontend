import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../data/entities/user';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../../../data/model/auth';
import { BaseResponse, LoginResponse, ItemResponse } from '../../../data/model/base-response';
import { PaginatedListResponse } from '../../../data/model/paginated-response';
import { Guid } from 'guid-typescript';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../data/model/paginated-request';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }

  helper = new JwtHelperService();

  constructor(public _http: HttpClient) {
    super(_http, "user");
  }


  login(model: LoginUser): Observable<LoginResponse<User>> {
    return this.http.post<LoginResponse<User>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.login}`, model);
  }

  register(user: User): Observable<ItemResponse<any>> {
    return this.http.post<ItemResponse<any>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.register}`, user);
  }

  IsLoggedIn() {
    if (this.helper.isTokenExpired(localStorage.getItem('token'))) {
      this.logout();
      return false;
    }

    return true;
  }

  logout() {
    localStorage.clear();
  }

  setToken(user: User, token: string) {
    localStorage.setItem('userEmail', user.email ? user.email : '');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  getUserDetails(): User {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : {};
  }
}
