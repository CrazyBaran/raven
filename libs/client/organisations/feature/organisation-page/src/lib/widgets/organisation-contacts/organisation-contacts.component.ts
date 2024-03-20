import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TilelayoutItemComponent } from '@app/client/shared/ui';

import { NgClass, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { organisationContactsStore } from './organisation-contacts.store';

@Component({
  selector: 'app-organisation-contacts-table',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    GridModule,
    NgOptimizedImage,
    TooltipModule,
    ButtonModule,
    NgClass,
  ],
  templateUrl: './organisation-contacts.component.html',
  styleUrls: ['./organisation-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [organisationContactsStore],
})
export class OrganisationContactsComponent {
  public organisationContactsStore = inject(organisationContactsStore);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);

  public getMailto(email: string): string {
    return `mailto:${email}`;
  }

  public rowCallback = (): Record<string, boolean> => {
    return { '!bg-white': true };
  };

  public loadMore(tableHeight: number): void {
    this.organisationContactsStore.loadMore(tableHeight);
  }
}
