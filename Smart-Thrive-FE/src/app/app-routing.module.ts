import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/components/app.layout/app.layout.component';
import path from 'path';
import { AuthGuard } from './core/guard/app.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./main/components/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./main/components/apps/apps.module').then(
            (m) => m.AppsModule
          ),
      },
      
    ],
  },
  { path: 'auth', canActivate: [AuthGuard], loadChildren: () => import('./main/components/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
