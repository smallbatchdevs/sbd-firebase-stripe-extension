
import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent}      from './modules/home/pages/homepage/homepage.component';
import {ViewPostComponent}      from './modules/home/pages/view-post/view-post.component';
import {EditPostComponent}      from './modules/home/pages/edit-post/edit-post.component';
import {LoginComponent} from './modules/home/pages/login/login.component';
import {AuthGuardService} from './shared/services/authGuard/auth-guard.service';
import {DashboardComponent} from './modules/home/pages/dashboard/dashboard.component';
import {FirebaseuiLoginComponent} from './modules/home/pages/firebaseui-login/firebaseui-login.component';
import {AboutComponent} from './modules/home/pages/about/about.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomepageComponent
  },
  {
    path: 'post/:uid',
    component: ViewPostComponent
  },
  {
    path: 'edit',
    component: EditPostComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:uid',
    component: EditPostComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  // {
  //   path: 'login',
  //   component: LoginComponent
  // },
  {
    path: 'login',
    component: FirebaseuiLoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
