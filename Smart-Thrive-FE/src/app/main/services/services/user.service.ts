import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../data/entities/user';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginUser, LoginWithtAnother } from '../../../data/model/auth';
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

  verifiedByGoogleToken(model: LoginWithtAnother): Observable<LoginResponse<User>> {
    return this.http.post<LoginResponse<User>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.loginWithAnother}`, model);
  }

  register(user: User): Observable<ItemResponse<any>> {
    return this.http.post<ItemResponse<any>>(`${ConstantsApi.user.baseUrl}${ConstantsApi.user.register}`, user);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post<any>(`${ConstantsApi.user.baseUrl}/send-otp`, { email });
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${ConstantsApi.user.baseUrl}/reset-password`, { email, otp, newPassword });
  }
  
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${ConstantsApi.user.baseUrl}/verify-otp`, { email, otp });
  }

  getByEmail(email: string): Observable<ItemResponse<User>> {
    return this.http.get<ItemResponse<User>>(`${this.getBaseUrl()}${ConstantsApi.getByEmail}/${email}`);
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
    localStorage.setItem('email', user.email ? user.email : '');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role?.roleName!);
  } 


  setEmail(email: string) {
    localStorage.setItem('userEmail', email ? email : '');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }
  
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUserEmail(): string {
    return localStorage.getItem('email') || '';
  }

  getUserDetails(): User {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : {};
  }
}
