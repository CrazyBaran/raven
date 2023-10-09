import { Routes } from '@angular/router';
import { OpportunitiesComponent } from './opportunities.component';

export const OPPORTUNITIES_ROUTES: Routes = [
  {
    path: '',
    component: OpportunitiesComponent,
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import(
            './components/opportunity-details/opportunity-details.component'
          ).then((c) => c.OpportunityDetailsComponent),
      },
    ],
  },
];
