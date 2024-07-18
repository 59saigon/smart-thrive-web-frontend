import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFooterComponent } from './app.footer/app.footer.component';
import { AppLayoutComponent } from './app.layout/app.layout.component';
import { AppMenuComponent } from './app.menu/app.menu.component';
import { AppSidebarComponent } from './app.sidebar/app.sidebar.component';
import { AppTopbarComponent } from './app.topbar/app.topbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AppMenuitemComponent } from './app.menu-item/app.menu-item.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { AppConfigModule } from './app-config/app-config.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppNavigatorComponent } from './app.navigator/app.navigator.component';

@NgModule({
  declarations: [
    AppTopbarComponent,
    AppSidebarComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppLayoutComponent,
    AppFooterComponent,
    AppNavigatorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    AvatarModule,
    MenuModule,
    ButtonModule,
    OverlayPanelModule,
    ToastModule,
    TableModule,
    AutoCompleteModule,
    AppConfigModule,
    BreadcrumbModule,
  ],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
