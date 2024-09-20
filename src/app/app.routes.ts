import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { authGuard } from './auth.guard';
import { ImprintComponent } from './imprint/imprint.component';
import { PolicyComponent } from './policy/policy.component';
import { MobileThreadComponent } from './main/thread/mobile-thread/mobile-thread.component';
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { NewPaswordComponent } from './login/new-pasword/new-pasword.component';
import { VerifyEmailComponent } from './login/verify-email/verify-email.component';
import { AvatarComponent } from './login/avatar/avatar.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  // <<<<< LOGIN ROUTES >>>>>
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'new-password', component: NewPaswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'create-avatar', component: AvatarComponent },
  // <<<<< MAIN ROUTES >>>>>
  {
    path: 'main/:nameOfContent/:id/:idUser/:idOfChat',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
    resolve: { auth: authGuard },
    children: [
      {
        path: 'user-profile',
        loadComponent: () =>
          import('./main/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent,
          ),
        resolve: { auth: authGuard },
      },
      {
        path: 'chat/:id/:userId/:idOfChat',
        loadComponent: () =>
          import('./main/chat/mobile-chat/mobile-chat.component').then(
            (m) => m.MobileChatComponent,
          ),
        resolve: { auth: authGuard },
      },
      {
        path: 'direct-chat/:id/:userId/:idOfChat',
        loadComponent: () =>
          import('./main/chat/direct-chat/direct-chat.component').then(
            (m) => m.DirectChatComponent,
          ),
        resolve: { auth: authGuard },
      },
    ],
  },
  { path: 'thread-mobile/:id1/:id2', component: MobileThreadComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'policy', component: PolicyComponent },
];

