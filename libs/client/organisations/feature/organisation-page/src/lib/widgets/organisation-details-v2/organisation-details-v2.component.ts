import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { trigger } from '@angular/animations';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TilelayoutItemComponent, fadeIn } from '@app/client/shared/ui';
import { ClampedChangedDirective } from '@app/client/shared/ui-directives';
import { TimesPipe } from '@app/client/shared/ui-pipes';
import { DialogUtil } from '@app/client/shared/util';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { selectOrganisationDetailsViewModel } from './organisation-details-v2.selectors';

@Component({
  selector: 'app-organisation-details-v2',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    ButtonModule,
    RouterLink,
    SkeletonModule,
    DatePipe,
    ClampedChangedDirective,
    NgClass,
    TimesPipe,
  ],
  templateUrl: './organisation-details-v2.component.html',
  styleUrls: ['./organisation-details-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('fadeIn', fadeIn())],
})
export class OrganisationDetailsV2Component {
  public type = input.required<'public' | 'details'>();
  public store = inject(Store);
  public cdr = inject(ChangeDetectorRef);

  public vm = this.store.selectSignal(selectOrganisationDetailsViewModel);

  public isDescriptionClamped = signal(false);
  public showMoreDescription = signal(false);

  public updateDescriptionParam = computed(() => ({
    [DialogUtil.queryParams.updateOrganisationDescription]:
      this.vm().currentOrganisationId,
  }));

  public descriptionByType = computed(() => {
    if (this.type() === 'public') {
      return this.vm().description;
    }

    return this.vm().customDescription;
  });

  public setIsDescriptionClamped(isClamped: boolean): void {
    this.isDescriptionClamped.set(isClamped);

    // This is a workaround to force the change detection to run (should work without it)
    this.cdr.detectChanges();
  }

  public toggleShowMoreBtn(): void {
    this.showMoreDescription.set(!this.showMoreDescription());

    // This is a workaround to force the change detection to run (should work without it)
    this.cdr.detectChanges();
  }
}
