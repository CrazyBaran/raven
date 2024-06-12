/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  FilesTreelistContainerComponent,
  PickerContainerComponent,
} from '@app/client/files/feature/files-table';
import { OrganisationsActions } from '@app/client/organisations/state';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { PanelBarModule } from '@progress/kendo-angular-layout';
import { SharepointHelperService } from '../../../../../../../files/data-access/src';
import { OpenInNewTabDirective } from '../../../../../../../shared/ui-directives/src';
import { selectOrganisationFilesViewModel } from './organisation-files.selectors';

@Component({
  selector: 'app-organisation-files',
  standalone: true,
  imports: [
    PanelBarModule,
    PickerContainerComponent,
    FilesTreelistContainerComponent,
    ButtonModule,
    LoaderModule,
    OpenInNewTabDirective,
  ],
  templateUrl: './organisation-files.component.html',
  styleUrls: ['./organisation-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationFilesComponent {
  public store = inject(Store);
  public sharepointHelper = inject(SharepointHelperService);

  protected readonly vm = this.store.selectSignal(
    selectOrganisationFilesViewModel,
  );

  public createOrganisationFolder(): void {
    this.store.dispatch(
      OrganisationsActions.createOrganisationSharepointFolder({
        id: this.vm().currentOrganisationId!,
      }),
    );
  }

  public sharepointUrl(): string {
    return this.sharepointHelper.getSharepointUrl(this.vm()?.sharepointFolder);
  }
}
