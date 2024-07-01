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

  loading = [false, false, false, false]

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 100000);
  }

  loginLabel: string = "Login";
  onLogin(index: number) {
    this.load(index);
    
    if (this.isUserObjectEmpty(this.loginUser)) {
      this.messageService.add({ severity: 'warn', summary: 'Fail', detail: 'Username and password are required' });
    }

    console.log(this.loginUser);
    this.userService.login(this.loginUser).subscribe({
      next: (response) => {
        if (response.result == null) {
          this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Not found account: " + this.loginUser.usernameOrEmail });
          return;
        }
        this.user = response.result;
        this.token = response.token;
        this.userService.setToken(this.user, this.token);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.messageService.add({ severity: 'warn', summary: 'Fail', detail: "Server is not enable." });
      },
    });
  }

  isUserObjectEmpty(user: LoginUser): boolean {
    return !user.usernameOrEmail || !user.password;
  }
}
