import { Component } from '@angular/core';
import { LoginUser, RegisterUser } from '../../../../data/model/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  register: RegisterUser = {} as RegisterUser;
}
