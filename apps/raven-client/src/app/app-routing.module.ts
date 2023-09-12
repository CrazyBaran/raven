import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { BadGatewayComponent } from './pages/bad-gateway/bad-gateway.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: 'access-denied',
        component: AccessDeniedPageComponent,
      },
    ],
  },
  {
    path: 'bad-gateway',
    component: BadGatewayComponent,
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
