import { NgModule, OnInit } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/components/app.layout.module';
import { NotfoundComponent } from './main/components/error/notfound/notfound.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Guid } from 'guid-typescript';
import { AuthGuard } from './core/guard/app.guard';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './core/interceptor/header.interceptor';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor, // Sử dụng custom interceptor
            multi: true, // Điều này cho phép có nhiều interceptor
        },
    MessageService, 
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
