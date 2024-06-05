import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { PackageComponent } from './package.component';


@NgModule({
  declarations: [
    PackageComponent
  ],
  imports: [
    CommonModule,
    PackageRoutingModule
  ]
})
export class PackageModule { }
