import { Component, inject, input } from '@angular/core';
import { ENVIRONMENT } from '@app/client/core/environment';
import { FilesService } from '@app/client/files/feature/data-access';
import { FilesActions } from '@app/client/files/feature/state';
import { SPItem } from '@app/client/files/sdk-pnptimeline';
import { PickerComponent } from '@app/client/files/ui';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { ButtonThemeColor } from '@progress/kendo-angular-buttons/common/models';

@Component({
  selector: 'app-picker-container',
  standalone: true,
  imports: [PickerComponent],
  templateUrl: './picker-container.component.html',
  styleUrl: './picker-container.component.scss',
})
export class PickerContainerComponent {
  public environment = inject(ENVIRONMENT);
  public filesService = inject(FilesService);
  public store = inject(Store);
  public msal = inject(MsalService);

  public sharepointFolder = input.required<string>();
  public theme = input<ButtonThemeColor>('primary');

  public onPickerChange(event: SPItem[]): void {
    const sharepointDirectoryId = this.sharepointFolder();
    const parentReference = {
      id: sharepointDirectoryId,
      driveId: this.environment.sharepointDriveId,
    };

    event.forEach((file) => {
      this.filesService
        .copyFile(file.sharepointIds.siteId, file.id, {
          parentReference,
        })
        .subscribe((res) => {
          if (res.status === 'failed') {
            this.store.dispatch(
              NotificationsActions.showErrorNotification({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content: (res as any).error.message,
              }),
            );
          } else {
            this.store.dispatch(
              FilesActions.getFiles({
                directoryUrl: sharepointDirectoryId!,
                folderId: '', //todo
              }),
            );
            this.store.dispatch(
              NotificationsActions.showSuccessNotification({
                content: `'${file.name}' copied successfully`,
              }),
            );
          }
        });
    });
  }
}
