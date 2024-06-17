import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../../../../data/model/auth';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { User } from '../../../../data/entities/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginUser: LoginUser = {} as LoginUser;
  user: User = {} as User;

  token: string = "";

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit(): void {

  }

  onLogin() {
    console.log(this.loginUser);
    this.userService.login(this.loginUser).subscribe({
      next: (response) => {
        this.user = response.result;
        this.token = response.token;
        this.userService.setToken(this.user, this.token);
        this.router.navigateByUrl('/');
        console.table(response.result);
      },
      error: (err) => {
        console.error('Error occurred:', err);
      },
    });
  }
}
