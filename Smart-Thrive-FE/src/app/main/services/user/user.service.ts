import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../data/entities/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  helper = new JwtHelperService();

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
