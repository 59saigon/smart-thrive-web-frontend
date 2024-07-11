declare var google: any;
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoginUser, LoginWithtAnother } from '../../../../data/model/auth';
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
      theme: 'outline',
      size: 'large',
      shape: 'circle',
      logo_alignment: "center",
      width: '100%',
      longTitle: true,
      onsuccess: 'onSuccess',
      onfailure: 'onFailure'
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

    if (this.isLoginWithGoogle) {
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
    var index = 0;
    if (response) {
      this.load(index); // Start loading state

      // Decode the token
      const payLoad = this.decodeToken(response.credential);
      console.log(payLoad);

      // Fetch user details by email
      this.userService.getByEmail(payLoad.email).subscribe({
        next: (res) => {
          // Clear loading state when response is received
          if (res.result == null) {
            this.registerIfLoginWithAnother(payLoad, index);
          }
          else {
            // Prepare data for alternative login method
          this.loginWithAnother(payLoad, index);
          }
          

        },
        error: (err) => {
          setTimeout(() => {
            this.clearLoading(index);
            this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Service is not enabled" });
          }, 1000);
        },
      });

    }
  }

  registerIfLoginWithAnother(payLoad: any, index: number) {
    // set user 
    this.user = {} as User;
    this.user.firstName = payLoad.given_name;
    this.user.lastName = payLoad.family_name;
    // update
    this.user.fullName = payLoad.name;
    this.user.username = payLoad.sub;
    this.user.email = payLoad.email;

    this.userService.register(this.user).subscribe({
      next: (response) => {
        if (response.result == null) {
          setTimeout(() => {
            this.clearLoading(index);
            this.messageService.add({ severity: 'warn', summary: 'Fail', detail: response.message });
          }, 1000);
          return;
        }
        // register successful
        this.loginWithAnother(payLoad, index);
      },
      error: (err) => {
        setTimeout(() => {
          this.clearLoading(index);
          this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Service is not enable" });
        }, 1000);
      },
    });
  }

  loginWithAnother(payLoad: any, index: number) {
    const loginWithAnother = {
      email: payLoad.email,
      email_verified: payLoad.email_verified
    } as LoginWithtAnother;

    // Attempt login with another method
    this.userService.loginWithAnother(loginWithAnother).subscribe({
      next: (response) => {
        // Clear loading state when response is received
        if (response.result == null) {
          setTimeout(() => {
            this.clearLoading(index);
            this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Login with another method failed: " + payLoad.email });
          }, 1000);
          return;
        }

        // Login successful
        this.user = response.result;
        this.token = response.token;
        this.userService.setToken(this.user, this.token);

        // Navigate to home page after successful login
        setTimeout(() => {
          this.clearLoading(index);
          window.location.reload();
        }, 2000);

      },
      error: (err) => {
        setTimeout(() => {
          this.clearLoading(index);
          this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Service is not enabled" });
        }, 1000);
      },
    });
  }
}