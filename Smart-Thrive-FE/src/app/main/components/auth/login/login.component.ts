import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginUser } from '../../../../data/model/auth';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { User } from '../../../../data/entities/user';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginUser: LoginUser = {} as LoginUser;
  user: User = {} as User;

  token: string = "";

  constructor(public userService: UserService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {

  }

  loading = [false, false, false, false];

  load(index: number) {
    this.loading[index] = true;
    this.loginLabel = "";
  }

  clearLoading(index: number) {
    setTimeout(() => { this.loading[index] = false; this.loginLabel = "Login"; }, 1000);
  }

  loginLabel: string = "Login";

  onLogin(index: number) {
    this.load(index);

    if (this.isUserObjectEmpty(this.loginUser)) {
      setTimeout(() => {
        this.clearLoading(index);
        this.messageService.add({ severity: 'warn', summary: 'Fail', detail: 'Username and password are required' });
      }, 1000);
      return;
    }

    console.log(this.loginUser);
    this.userService.login(this.loginUser).subscribe({
      next: (response) => {
        // Clear loading state when response is received
        if (response.result == null) {
          setTimeout(() => {
            this.clearLoading(index);
            this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Not found account: " + this.loginUser.usernameOrEmail });
          }, 1000);
          return;
        }
        this.user = response.result;
        this.token = response.token;
        this.userService.setToken(this.user, this.token);
        setTimeout(() => { this.clearLoading(index); this.router.navigateByUrl('/'); }, 2000);

      },
      error: (err) => {
        setTimeout(() => {
          this.clearLoading(index);
          this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Service is not enable" });
        }, 1000);
      },
    });
  }

  isUserObjectEmpty(user: LoginUser): boolean {
    return !user.usernameOrEmail || !user.password;
  }
}
