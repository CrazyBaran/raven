import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SsoComponent } from './pages/sso/sso.component';

import { RvncAuthComponent } from './rvnc-auth.component';

const routes: Routes = [
  {
    path: '',
    component: RvncAuthComponent,
    children: [
      {
        path: 'auth',
        children: [
          {
            path: '',
            component: SsoComponent,
            data: { animation: 'EmailValidation' },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RvncAuthRoutingModule {}
