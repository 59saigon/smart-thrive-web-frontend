import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../../../../data/model/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  login: LoginUser = {} as LoginUser;

  ngOnInit(): void {
    
  }
}
