declare var google: any;
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoginUser } from '../../../../data/model/auth';
import { UserService } from '../../../services/services/user.service';
import { Router } from '@angular/router';
import { User } from '../../../../data/entities/user';
import { MessageService } from 'primeng/api';
import { ArgumentOutOfRangeError } from 'rxjs';

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
  isLoginWithGoogle: boolean = false;

  constructor(public userService: UserService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('/auth/login/')) {
        this.isLoginWithGoogle = true;
    }
    
    google.accounts.id.initialize({
      client_id: '311399879185-vic40gludgaeulfo790m0h48h1cvul7u.apps.googleusercontent.com',
      callback: (resp: any) => {
        this.handleLogin(resp);
      }
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 350
    });
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

    if ((!this.isLoginWithGoogle) && this.isUserObjectEmpty(this.loginUser)) {
      setTimeout(() => {
        this.clearLoading(index);
        this.messageService.add({ severity: 'warn', summary: 'Fail', detail: 'Username and password are required' });
      }, 1000);
      return;
    }

    if(this.isLoginWithGoogle) {
      this.loginUser.usernameOrEmail = this.userService.getUserEmail();
    }

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

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }
  
  backToLogin() {
    this.userService.logout();
    window.location.reload();
  }

  handleLogin(response: any) {
    if (response) {
      //decode the token
      const payLoad = this.decodeToken(response.credential);
      //set token
      console.table(payLoad.email)
      this.userService.getByEmail(payLoad.email).subscribe({
        next: (res) => {
          // Clear loading state when response is received
          if (res.result == null) {
            setTimeout(() => {
              this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Not found account: " + this.loginUser.usernameOrEmail });
            }, 1000);
            return;
          }
          // this.user = res.result;
          // this.token = response.credential;
          // this.userService.setToken(this.user, this.token);
          this.userService.setEmail(payLoad.email);
          this.router.navigateByUrl(`/auth/login/${response.credential}`);
          this.isLoginWithGoogle = true;
        },
        error: (err) => {
          setTimeout(() => {
            this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Service is not enable" });
          }, 1000);
        },
      });
    }
  }
}
