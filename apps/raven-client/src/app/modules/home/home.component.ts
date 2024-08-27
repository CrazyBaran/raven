import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Params, RouterOutlet } from '@angular/router';
import { ENVIRONMENT } from '@app/client/core/environment';
import { PipelinesActions, pipelinesQuery } from '@app/client/pipelines/state';
import { RemindersActions, remindersQuery } from '@app/client/reminders/state';
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

  public pipelineViews = this.store.selectSignal(
    pipelinesQuery.selectAllPipelineViews,
  );
  public readonly mainRoutes2 = computed((): UiNavAsideRoute[] => {
    let customViews: UiNavAsideRoute[] = [];
    const pipelineViewsValue = this.pipelineViews();
    const defaultQueryParams: Params = { view: null };
    if (pipelineViewsValue) {
      customViews = pipelineViewsValue?.map((v) => {
        if (v?.isDefault) {
          defaultQueryParams['view'] = v?.id ?? null;
        }
        return {
          id: v?.id,
          name: v?.name,
          path: `companies/pipeline`,
          icon: v?.icon ?? '',
          isDefault: !!v?.isDefault,
          queryParams: {
            view: v?.id,
          },
        };
      }) as UiNavAsideRoute[];
    }
    return [
      {
        name: 'Home Dashboard',
        path: '',
        icon: 'fa-sharp fa-solid fa-grid',
        exact: true,
        navigate: true,
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
            icon: 'fa-regular fa-star',
            disabled: !this.environment.shortlistsFeature,
          },
        ],
      },
      {
        name: 'Pipeline',
        path: 'companies/pipeline',
        icon: 'fa-solid fa-rotate-270 fa-diagram-next',
        queryParams: defaultQueryParams,
        navigate: true,
        disabled: !this.pipelineViews(),
        subRoutes: [
          {
            name: 'Full Pipeline',
            path: 'companies/pipeline',
            icon: 'fa-regular fa-table-columns',
            exact: true,
          },
          ...customViews,
        ],
      },
      {
        name: 'Managers',
        path: 'managers',
        icon: 'fa-solid fa-building-columns',
        navigate: true,
      },
      {
        name: 'Notes',
        path: 'notes',
        icon: 'fa-solid fa-notebook',
        navigate: true,
      },
      {
        name: 'Reminders',
        path: 'reminders',
        icon: 'fa-solid fa-alarm-clock',
        disabled: !this.environment.remindersFeature,
        navigate: true,
        badge: {
          value: this.remindersCount(),
        },
      },
    ];
  });

  public constructor() {
    this.store.dispatch(RemindersActions.getRemindersStats());
    this.store.dispatch(PipelinesActions.getPipelines());
  }
}
