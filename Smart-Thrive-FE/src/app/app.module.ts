import { NgModule, OnInit } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/components/app.layout.module';
import { NotfoundComponent } from './main/components/error/notfound/notfound.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Guid } from 'guid-typescript';
import { UserService } from './main/services/user/user.service';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [MessageService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
