import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TrackByFunction,
} from '@angular/core';

import { NgClass } from '@angular/common';
import { ENVIRONMENT } from '@app/client/core/environment';
import { FilesService } from '@app/client/files/feature/data-access';
import {
  PickerComponent,
  selectFileTags,
  selectFolderChildrenFactory,
} from '@app/client/files/feature/files-table';
import { FileEntity, FilesActions } from '@app/client/files/feature/state';
import { SPItem } from '@app/client/files/sdk-pnptimeline';
import { OrganisationsActions } from '@app/client/organisations/state';
import {
  TagComponent,
  TilelayoutItemComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { TagData } from '@app/rvns-tags';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import {
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { RxPush } from '@rx-angular/template/push';
import _ from 'lodash';
import { filter, first, map, Observable } from 'rxjs';
import {
  FileRow,
  selectFilesTableViewModelFactory,
  selectOrganisationFilesViewModel,
} from './organisation-files.selectors';

@Component({
  selector: 'app-organisation-files',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    PickerComponent,
    TreeListModule,
    NgClass,
    TagComponent,
    ButtonModule,
    LoaderModule,
    UserTagDirective,
    RxPush,
  ],
  templateUrl: './organisation-files.component.html',
  styleUrls: ['./organisation-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationFilesComponent {
  public store = inject(Store);
  public environment = inject(ENVIRONMENT);
  public filesService = inject(FilesService);

  public sharepointUrl = this.environment.sharepointRoot;
  public sharepointList = this.environment.sharepointList;
  public sharepointWeb = this.environment.sharepointWeb;

  protected readonly vm = this.store.selectSignal(
    selectOrganisationFilesViewModel,
  );

  // files
  public fileTable = this.store.selectSignal(
    selectFilesTableViewModelFactory(this.environment),
  );

  public source = computed(() => this.fileTable().source, { equal: _.isEqual });

  public fetchChildren: TreeListComponent['fetchChildren'] = (
    item: FileRow,
  ): Observable<FileRow[]> => {
    setTimeout(() => {
      this.store.dispatch(
        FilesActions.getFiles({
          directoryUrl: item.folderUrl!,
          folderId: item.id,
        }),
      );
    });

    return this.store
      .select(selectFolderChildrenFactory(this.environment)(item.id))
      .pipe(
        filter((res) => res.isLoaded!),
        map((res) => res.files),
        first(),
      );
  };

  public hasChildren = (item: FileRow): boolean => {
    return item.type === 'folder' && item.childrenCount! > 0;
  };

  public rowCallback = (context: RowClassArgs): Record<string, boolean> => {
    if (context.dataItem.type == 'folder') {
      return { 'folder-row': true };
    }
    return { 'file-row': true };
  };

  public getTagsSource(file: FileEntity): Observable<TagData[]> {
    return this.store.select(selectFileTags(file));
  }

  public openFileWebUrl(file: FileRow): void {
    window.open(file.url, '_blank');
  }

  public trackBy: TrackByFunction<FileRow> = (index: number, item: FileRow) =>
    item.id;

  public createOrganisationFolder(): void {
    this.store.dispatch(
      OrganisationsActions.createOrganisationSharepointFolder({
        id: this.vm().currentOrganisationId!,
      }),
    );
  }

  public onPickerChange(event: SPItem[]): void {
    const sharepointDirectoryId = this.vm().sharepointFolder!;

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
