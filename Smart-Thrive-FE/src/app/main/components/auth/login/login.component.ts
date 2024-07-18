declare var google: any;
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoginUser, LoginWithtAnother } from '../../../../data/model/auth';
import { UserService } from '../../../services/services/user.service';
import { Router } from '@angular/router';
import { User } from '../../../../data/entities/user';
import { MessageService } from 'primeng/api';
import { ArgumentOutOfRangeError } from 'rxjs';
import Swal from 'sweetalert2';

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
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Username && password required!",
        });
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
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Not found account: " + this.loginUser.usernameOrEmail,
            });
          }, 1000);
          return;
        }

        if (response.result.role?.roleName == 'Buyer') {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "This account does not have access rights!",
          });
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
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
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
      const payLoad = this.decodeToken(response.credential);
      console.log(payLoad);

      this.verifiedByGoogleToken(payLoad, response.credential);

    }
  }

  resetPassword() {
    Swal.fire({
      title: "Email",
      text: "Enter your email.",
      icon: "info",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Next",
      inputValidator: (email) => {
        return new Promise((resolve, reject) => {
          if (!email) {
            resolve('Please enter your email!');
          } else {
            resolve(); // Proceed if email is provided
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const email = result.value;
        
        // Send OTP
        this.userService.sendOtp(email).subscribe({
          next: () => {
            Swal.fire({
              title: "OTP Sent",
              text: "An OTP has been sent to your email. Please enter it to verify.",
              icon: "info",
              input: "text",
              inputPlaceholder: "Enter OTP",
              showCancelButton: true,
              confirmButtonText: "Verify",
              inputValidator: (otp) => {
                return new Promise((resolve, reject) => {
                  if (!otp) {
                    resolve('Please enter the OTP!');
                  } else {
                    resolve(); // Proceed if OTP is provided
                  }
                });
              }
            }).then((result) => {
              if (result.isConfirmed) {
                const otp = result.value;
                
                // Verify OTP
                this.userService.verifyOtp(email, otp).toPromise()
                  .then(response => {
                    console.log("very", response.valid)
                    if (response.valid) {
                      Swal.fire({
                        title: "New Password",
                        text: "Enter your new password.",
                        icon: "info",
                        input: "password",
                        inputPlaceholder: "Enter new password",
                        showCancelButton: true,
                        confirmButtonText: "Reset Password",
                        inputValidator: (password) => {
                          return new Promise((resolve, reject) => {
                            if (!password) {
                              resolve('Please enter your new password!');
                            } else {
                              resolve(); // Proceed if new password is provided
                            }
                          });
                        }
                      }).then((result) => {
                        if (result.isConfirmed) {
                          const newPassword = result.value;
                          
                          // Reset password
                          this.userService.resetPassword(email, otp, newPassword).subscribe({
                            next: (response) => {
                              if (response.isSuccess) {
                                Swal.fire('Success', 'Your password has been reset successfully.', 'success');
                              } else {
                                Swal.fire('Error', response.message, 'error');
                              }
                            },
                            error: () => {
                              Swal.fire('Error', 'Failed to reset password. Please try again later.', 'error');
                            }
                          });
                        }
                      });
                    } else {
                      Swal.fire('Error', 'Invalid OTP. Please try again.', 'error');
                    }
                  })
                  .catch(error => {
                    Swal.fire('Error', `Verification failed: ${error}`, 'error');
                  });
              }
            });
          },
          error: () => {
            Swal.fire('Error', 'Failed to send OTP. Please try again later.', 'error');
          }
        });
      }
    });
  }
  
  

  verifiedByGoogleToken(payLoad: any, _googleToken: any) {
    const loginWithAnother = {
      email: payLoad.email,
      email_verified: payLoad.email_verified,
      googleToken: _googleToken
    } as LoginWithtAnother;

    this.userService.verifiedByGoogleToken(loginWithAnother).subscribe({
      next: (response) => {
        if (response.result == null) {
          setTimeout(() => {
            this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Login with another method failed: " + payLoad.email });
          }, 1000);
          return;
        }

        if (response.result.role?.roleName == 'Buyer') {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "This account does not have access rights!",
          });
          return;
        }

        this.user = response.result;
        this.token = response.token;
        this.userService.setToken(this.user, this.token);


        window.location.reload();

      },
      error: (err) => {
        setTimeout(() => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });

        }, 1000);
      },
    });
  }
}