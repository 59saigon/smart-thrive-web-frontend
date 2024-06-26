import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../data/entities/user';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../../../data/model/auth';
import { BaseResponse, LoginResponse, SingleResponse } from '../../../data/model/base-response';
import { PaginatedListResponse } from '../../../data/model/paginated-response';
import { Guid } from 'guid-typescript';
import { PaginatedRequest, PaginatedRequestFillter } from '../../../data/model/paginated-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  helper = new JwtHelperService();
  constructor(public http: HttpClient) {
  }

  addUser(user: User): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.addUser}`, user);
  }

  updateUser(user: User): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.updateUser}`, user);
  }

  deleteUser(userId: Guid): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.deleteUser}/${userId}`);
  }

  getAllUser(request: PaginatedRequest): Observable<PaginatedListResponse<User>> {
    return this.http.post<PaginatedListResponse<User>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.getAllUser}`, request);
  }

  getAllUserSearch(request: PaginatedRequestFillter<User>): Observable<PaginatedListResponse<User>> {
    return this.http.post<PaginatedListResponse<User>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.getAllUserSearch}`, request);
  }

  getById(id: Guid): Observable<SingleResponse<User>> {
    return this.http.get<SingleResponse<User>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.getUser}/${id}`);
  }

  login(model: LoginUser): Observable<LoginResponse<User>> {
    return this.http.post<LoginResponse<User>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.login}`, model);
  }

  register(user: User): Observable<SingleResponse<any>> {
    return this.http.post<SingleResponse<any>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.register}`, user);
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
