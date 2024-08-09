import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';

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
})
export class OrganisationContactsComponent {
  @Input()
  public hideHeader = true;

  public organisationContactsStore = inject(organisationContactsStore);

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
