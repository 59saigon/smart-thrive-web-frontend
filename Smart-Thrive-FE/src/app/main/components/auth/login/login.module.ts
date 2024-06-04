import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox'
import { ContextMenuModule } from 'primeng/contextmenu'

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    LoginRoutingModule,
    ContextMenuModule,
  ]
})
export class LoginModule { }
