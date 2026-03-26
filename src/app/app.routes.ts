import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: Register },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
