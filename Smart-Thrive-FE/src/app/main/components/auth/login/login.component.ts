import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../../../../data/model/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  login: LoginUser = {
    emailOrUsername: '',
    password: '',
    isRemember: false,
  }

  ngOnInit(): void {
    
  }
}
