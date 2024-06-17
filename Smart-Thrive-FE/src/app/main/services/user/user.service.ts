import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../data/entities/user';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../../../data/model/auth';
import { BaseResponseBool, BaseResponseList, BaseResponseWithResult, LoginResponse } from '../../../data/model/response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  helper = new JwtHelperService();
  constructor(public http: HttpClient) {
  }

  addUser(user: User): Observable<BaseResponseBool> {
    return this.http.post<BaseResponseBool>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.addUser}`, user);
  }

  updateUser(user: User): Observable<BaseResponseBool> {
    return this.http.put<BaseResponseBool>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.updateUser}`, user);
  }

  deleteUser(userId: number): Observable<BaseResponseBool> {
    return this.http.delete<BaseResponseBool>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.deleteUser}/${userId}`);
  }

  getAllUser(): Observable<BaseResponseList<User>> {
    return this.http.get<BaseResponseList<User>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.getAllUser}`);
  }

  login(credentials: any): Observable<LoginResponse<any>> {
    return this.http.post<LoginResponse<any>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.login}`, credentials);
  }

  register(user: any): Observable<BaseResponseWithResult<any>> {
    return this.http.post<BaseResponseWithResult<any>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.register}`, user);
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
