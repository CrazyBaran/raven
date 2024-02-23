import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShelfModule, ShelfStoreFacade } from '@app/client/shared/shelf';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { NavAsideComponent } from '../../components/nav-aside/nav-aside.component';
import { UiNavAsideRoute } from '../../components/nav-aside/nav-aside.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavAsideComponent,
    RouterOutlet,
    WindowModule,
    ShelfModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public shelfFacade = inject(ShelfStoreFacade);

  public readonly mainRoutes2: UiNavAsideRoute[] = [
    {
      name: 'Home Dashboard',
      path: '',
      icon: 'fa-sharp fa-solid fa-grid',
      exact: true,
    },
    {
      name: 'Companies',
      path: 'companies',
      icon: 'fa-solid fa-building',
      subRoutes: [
        {
          name: 'All Companies',
          path: 'companies',
          icon: 'fa-regular fa-cart-shopping',
          exact: true,
        },
        {
          name: 'Shortlist',
          path: 'companies/shortlist',
          icon: 'fa-solid fa-check',
          disabled: true,
        },
        {
          name: 'Pipeline',
          path: 'companies/pipeline',
          icon: 'fa-regular fa-fire',
        },
      ],
    },
    {
      name: 'Notes',
      path: 'notes',
      icon: 'fa-solid fa-notebook',
      subRoutes: [
        {
          name: 'All Notes',
          path: 'notes',
          icon: 'fa-solid fa-notebook',
          exact: true,
        },
      ],
    },
    {
      name: 'Reminders',
      path: 'reminders',
      icon: 'fa-solid fa-alarm-clock',
      disabled: true,
    },
  ];
}
