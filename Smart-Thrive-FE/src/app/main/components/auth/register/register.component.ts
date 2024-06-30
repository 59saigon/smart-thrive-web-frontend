import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginUser, RegisterUser } from '../../../../data/model/auth';
import { User } from '../../../../data/entities/user';
import { UserService } from '../../../services/user/user.service';
import { ItemResponse } from '../../../../data/model/base-response';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  
  user: User = {} as User;
  firstName!: string;
  lastName!: string;
  gender!: string;
  confirmPassword!: string;

  constructor(public userService: UserService, private router: Router, private messageService: MessageService) { }
  ngOnInit(): void {
    this.user.gender= 'Female'
  }

  itemResponse: ItemResponse<User> = {} as ItemResponse<User>;

  onRegister() {
    // check password with confirm password
    if (this.user.password != this.confirmPassword) {
      this.messageService.add({severity:'warn', summary: 'Fail', detail: 'Not match password'});
    }

    this.user.fullName = this.firstName + " " + this.lastName;
    if (this.gender) {
      this.user.gender = this.gender;
    }

    this.userService.register(this.user).subscribe({
      next: (response) => {
        this.user = response.result;
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Register'});
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error('Error occurred:', err);
      },
    });
    
  }

}
