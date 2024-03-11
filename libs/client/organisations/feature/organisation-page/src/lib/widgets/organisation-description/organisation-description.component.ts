import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { selectOrganisationDetailsViewModel } from './organisation-description.selectors';

@Component({
  selector: 'app-organisation-details',
  standalone: true,
  imports: [TilelayoutItemComponent, ButtonModule, RouterLink],
  templateUrl: './organisation-description.component.html',
  styleUrls: ['./organisation-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDescriptionComponent {
  public store = inject(Store);

  public vm = this.store.selectSignal(selectOrganisationDetailsViewModel);
}
