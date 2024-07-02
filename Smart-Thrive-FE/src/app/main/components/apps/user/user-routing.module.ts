import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';

const routes: Routes = [{ path: '', component: UserComponent }, { path: 'student', loadChildren: () => import('./student/student.module').then(m => m.StudentModule) }, { path: 'provider', loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
