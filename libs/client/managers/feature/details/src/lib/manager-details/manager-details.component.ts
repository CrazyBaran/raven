import { trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ManagersActions } from '@app/client/managers/state';
import {
  ManagerPortfolioOrganisationsComponent,
  ManagerProfileComponent,
  ManagerRelationShipsComponent,
  RelationshipStrengthComponent,
} from '@app/client/managers/ui';
import { fadeIn } from '@app/client/shared/ui';
import { PageTemplateComponent } from '@app/client/shared/ui-templates';
import { TagsActions } from '@app/client/tags/state';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import {
  TabStripComponent,
  TabStripModule,
} from '@progress/kendo-angular-layout';
import { FundManagerRelationStrength } from 'rvns-shared';
import { selectManagerDetailsViewModel } from './manager-details.selectors';

@Component({
  selector: 'app-manager-details',
  standalone: true,
  imports: [
    CommonModule,
    PageTemplateComponent,
    TabStripModule,
    SkeletonModule,
    ButtonModule,
    RouterLink,
    RelationshipStrengthComponent,
    ManagerProfileComponent,
    ManagerRelationShipsComponent,
    ManagerPortfolioOrganisationsComponent,
  ],
  templateUrl: './manager-details.component.html',
  styleUrl: './manager-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [trigger('fadeIn', fadeIn())],
})
export class ManagerDetailsComponent implements OnInit {
  protected readonly store = inject(Store);
  protected readonly route = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly vm = this.store.selectSignal(
    selectManagerDetailsViewModel,
  );

  protected tabstrip = viewChild(TabStripComponent);

  public ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.store.dispatch(ManagersActions.getManager({ id: params['id'] }));
        this.tabstrip()?.selectTab(0);
      });

    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({
        tagTypes: ['people'],
      }),
    );
  }

  public updateRelationshipStrength(relationshipStrength: string): void {
    this.store.dispatch(
      ManagersActions.updateManager({
        id: this.vm().managerId,
        changes: {
          relationshipStrength:
            relationshipStrength as FundManagerRelationStrength,
        },
      }),
    );
  }

  public updateKeyRelationships(keyRelationships: Array<string>): void {
    this.store.dispatch(
      ManagersActions.updateManager({
        id: this.vm().managerId,
        changes: {
          keyRelationships,
        },
      }),
    );
  }
}
