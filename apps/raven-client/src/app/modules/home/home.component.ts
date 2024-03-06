import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ENVIRONMENT } from '@app/client/core/environment';
import { remindersQuery } from '@app/client/reminders/state';
import { ShelfModule } from '@app/client/shared/shelf';
import { Store } from '@ngrx/store';
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
  public environment = inject(ENVIRONMENT);
  public store = inject(Store);

  public remindersCount = this.store.selectSignal(
    remindersQuery.selectTotalCount,
  );

  public readonly mainRoutes2 = computed((): UiNavAsideRoute[] => [
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
          path: 'companies/shortlists',
          icon: 'fa-solid fa-star',
          disabled: !this.environment.shortlistsFeature,
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
      disabled: !this.environment.remindersFeature,
      exact: true,
      navigate: true,
      badge: {
        value: this.remindersCount(),
      },
    },
  ]);
}
