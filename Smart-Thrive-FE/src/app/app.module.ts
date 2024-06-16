import { NgModule, OnInit } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/components/app.layout.module';
import { NotfoundComponent } from './main/components/error/notfound/notfound.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Guid } from 'guid-typescript';
import { AuthGuard } from './core/guard/app.guard';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [MessageService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {
}
