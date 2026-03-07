import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './features/login/login.component';
import { SignUpComponent } from './features/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotificationComponent } from './features/notification/notification.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Sociax: Login' },
      { path: 'signup', component: SignUpComponent, title: 'Sociax: Sign Up' },
      { path: 'forget', component: ForgotPasswordComponent, title: 'Sociax: Forget Password' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent, title: 'Sociax: Feed' },
      { path: 'profile', component: ProfileComponent, title: 'Sociax: Profile' },
      { path: 'notification', component: NotificationComponent, title: 'Sociax: Notification' },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('./features/user-profile/user-profile.component').then(
            (c) => c.UserProfileComponent,
          ),
      },
    ],
  },
  { path: '**', component: NotFoundComponent, title: 'Not Found Page' },
];
