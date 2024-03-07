import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { trigger } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { fadeIn, TilelayoutItemComponent } from '@app/client/shared/ui';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { selectOrganisationDetailsViewModel } from './organisation-details.selectors';

@Component({
  selector: 'app-organisation-details',
  standalone: true,
  imports: [TilelayoutItemComponent, ButtonModule, RouterLink, SkeletonModule],
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('fadeIn', fadeIn())],
})
export class OrganisationDetailsComponent {
  public store = inject(Store);

  public vm = this.store.selectSignal(selectOrganisationDetailsViewModel);
}
