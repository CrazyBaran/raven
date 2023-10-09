import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './core/guards/can-activate.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateGuard],
    loadChildren: () =>
      import('./modules/home/home-routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('@app/rvnc-auth').then((m) => m.RvncAuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
