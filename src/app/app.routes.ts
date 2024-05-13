import { Routes } from '@angular/router';
import {DiscoverComponent} from "./main-page/discover/discover.component";
import {ObservedComponent} from "./main-page/observed/observed.component";
import {OrganiseComponent} from "./main-page/organise/organise.component";
import {ProfileComponent} from "./main-page/profile/profile.component";
import {AuthComponent} from "./auth/auth.component";
import {LoginFormComponent} from "./auth/login-form/login-form.component";
import {RegisterFormComponent} from "./auth/register-form/register-form.component";
import {MainPageComponent} from "./main-page/main-page.component";


export const routes: Routes = [
  { path: '', redirectTo: '/discover', pathMatch: 'full'},
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        title: 'Login Page',
        component: LoginFormComponent
      },
      {
        path: 'register',
        title: 'Register Page',
        component: RegisterFormComponent
      }
    ]
  },
  {
    path: 'main',
    component: MainPageComponent,
    children: [
      { path: 'discover', component: DiscoverComponent },
      { path: 'observed', component: ObservedComponent },
      { path: 'organise', component: OrganiseComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '**', redirectTo: '/'}
];
