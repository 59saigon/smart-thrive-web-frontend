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
        path: '',
        loadChildren: () =>
          import('./main/components/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
  { path: 'auth', loadChildren: () => import('./main/components/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
