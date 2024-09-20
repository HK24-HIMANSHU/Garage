import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { ProfileComponent } from './component/profile/profile.component';

export const routes: Routes = [
    { path:'', redirectTo:'/login',pathMatch:'full'},
    { path:'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: 'profile', component: ProfileComponent},
];
