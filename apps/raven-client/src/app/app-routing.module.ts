import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { BadGatewayComponent } from './pages/bad-gateway/bad-gateway.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginComponent } from './pages/login/login.component';
import { MsalGuard } from '@azure/msal-angular';
import { CanActivateGuard } from './core/guards/can-activate.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [CanActivateGuard, MsalGuard],
    children: [
      {
        path: 'access-denied',
        component: AccessDeniedPageComponent,
      },
      {
        path: 'bad-gateway',
        component: BadGatewayComponent,
      },
    ],
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    loadChildren: () => import('@app/rvnc-auth').then((m) => m.RvncAuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
