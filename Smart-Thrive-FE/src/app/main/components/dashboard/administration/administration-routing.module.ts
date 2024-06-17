import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'package',
    loadChildren: () =>
      import('./package/package.module').then((m) => m.PackageModule),
  },
  {
    path: 'course',
    loadChildren: () =>
      import('./course/course.module').then((m) => m.CourseModule),
  },
  { path: 'order', loadChildren: () => import('./order/order.module').then(m => m.OrderModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
