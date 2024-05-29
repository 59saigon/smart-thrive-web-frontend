import { NgModule, OnInit } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/components/app.layout.module';
import { NotfoundComponent } from './main/components/error/notfound/notfound.component';
import { PrimeNGConfig } from 'primeng/api';
import { Guid } from 'guid-typescript';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  constructor(private primengConfig: PrimeNGConfig) {}
  
  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
