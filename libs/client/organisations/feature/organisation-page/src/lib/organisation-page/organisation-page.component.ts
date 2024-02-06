import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TrackByFunction,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RelatedNotesTableComponent } from '@app/client/opportunities/ui';
import {
  OrganisationsActions,
  organisationsFeature,
} from '@app/client/organisations/state';
import { ShelfActions } from '@app/client/shared/shelf';
import {
  fadeIn,
  LoaderComponent,
  TagComponent,
  TilelayoutItemComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import {
  DealLeadsPipe,
  DealTeamPipe,
  TimesPipe,
} from '@app/client/shared/ui-pipes';
import { PageTemplateComponent } from '@app/client/shared/ui-templates';
import { Store } from '@ngrx/store';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule, RowClassArgs } from '@progress/kendo-angular-grid';
import { TileLayoutModule } from '@progress/kendo-angular-layout';
import { SortDescriptor } from '@progress/kendo-data-query';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';

import { trigger } from '@angular/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ENVIRONMENT } from '@app/client/core/environment';
import { FilesService } from '@app/client/files/feature/data-access';
import {
  PickerComponent,
  selectFileTags,
  selectFolderChildrenFactory,
} from '@app/client/files/feature/files-table';
import { FileEntity, FilesActions } from '@app/client/files/feature/state';
import { SPItem } from '@app/client/files/sdk-pnptimeline';
import { NotesTableContainerComponent } from '@app/client/notes/feature/notes-table';
import { PipelinesActions } from '@app/client/pipelines/state';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { TagData } from '@app/rvns-tags';
import {
  LoaderModule,
  SkeletonModule,
} from '@progress/kendo-angular-indicators';
import {
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import * as _ from 'lodash';
import { filter, first, map, Observable } from 'rxjs';
import {
  FileRow,
  selectFilesTableViewModelFactory,
  selectOrganisationPageViewModel,
} from './organisation-page.selectors';

@Component({
  selector: 'app-opportunity-details-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ButtonsModule,
    RelatedNotesTableComponent,
    RxFor,
    LoaderComponent,
    PageTemplateComponent,
    GridModule,
    TileLayoutModule,
    DealLeadsPipe,
    DealTeamPipe,
    TagComponent,
    UserTagDirective,
    RxIf,
    TimesPipe,
    SkeletonModule,
    TreeListModule,
    NotesTableContainerComponent,
    LoaderModule,
    PickerComponent,
    TilelayoutItemComponent,
    IsEllipsisActiveDirective,
  ],
  templateUrl: './organisation-page.component.html',
  styleUrls: ['./organisation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('fadeIn', fadeIn())],
})
export class OrganisationPageComponent {
  public sort: SortDescriptor[] = [
    {
      field: 'createdAt',
      dir: 'desc',
    },
  ];
  public environment = inject(ENVIRONMENT);

  public sharepointUrl = this.environment.sharepointRoot;
  public sharepointList = this.environment.sharepointList;
  public sharepointWeb = this.environment.sharepointWeb;

  public source = computed(() => this.fileTable().source, { equal: _.isEqual });
  protected store = inject(Store);
  protected router = inject(Router);
  protected filesService = inject(FilesService);

  protected vm = this.store.selectSignal(selectOrganisationPageViewModel);

  // files
  protected fileTable = this.store.selectSignal(
    selectFilesTableViewModelFactory(this.environment),
  );

  public constructor() {
    const organizationId = this.vm().currentOrganisationId;

    if (!organizationId) {
      throw new Error(
        'Organization ID is required for Opportunity Details Page',
      );
    }

    this.store.dispatch(
      OrganisationsActions.getOrganisation({ id: organizationId }),
    );

    this.store.dispatch(PipelinesActions.getPipelines());

    this.store
      .select(organisationsFeature.selectCurrentOrganisation)
      .pipe(
        takeUntilDestroyed(),
        filter((o) => !!o),
      )
      .subscribe((organisation) => {
        this.store.dispatch(
          FilesActions.getFiles({
            directoryUrl: organisation!.sharepointDirectory!,
            folderId: organisation!.sharepointDirectory!,
          }),
        );
      });
  }

  public openOpportunityDialog(): void {
    this.store.dispatch(
      ShelfActions.openOpportunityForm({
        payload: {
          organisationId: this.vm().currentOrganisationId,
        },
      }),
    );
  }

  public openNoteShelf(): void {
    this.store.dispatch(ShelfActions.openNotepad());
  }

  public trackBy: TrackByFunction<FileRow> = (index: number, item: FileRow) =>
    item.id;

  public getTagsSource(file: FileEntity): Observable<TagData[]> {
    return this.store.select(selectFileTags(file));
  }

  public hasChildren = (item: FileRow): boolean => {
    return item.type === 'folder' && item.childrenCount! > 0;
  };

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

  public rowCallback = (context: RowClassArgs): Record<string, boolean> => {
    if (context.dataItem.type == 'folder') {
      return { 'folder-row': true };
    }
    return { 'file-row': true };
  };

  public openFileWebUrl(file: FileRow): void {
    window.open(file.url, '_blank');
  }

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
