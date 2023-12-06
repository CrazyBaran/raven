import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilesService } from '@app/client/files/feature/data-access';
import {
  FileEntity,
  FilesActions,
  filesQuery,
} from '@app/client/files/feature/state';
import { SPItem } from '@app/client/files/sdk-pnptimeline';
import { FileTypeBadgeComponent } from '@app/client/files/ui';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  BadgeComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { NotificationsActions } from '@app/client/shared/util-notifications';
import { TagsActions, tagsQuery } from '@app/client/tags/state';
import { TagData } from '@app/rvns-tags';
import { Actions, ofType } from '@ngrx/effects';
import { createSelector, Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { GridModule, RowClassArgs } from '@progress/kendo-angular-grid';
import { FormFieldModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { PanelBarModule } from '@progress/kendo-angular-layout';
import {
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import * as _ from 'lodash';
import { filter, first, map, Observable } from 'rxjs';
import { PickerComponent } from '../picker/picker.component';

type FileRow = {
  type: 'file' | 'folder';
  id: string;
  url: string;
  name: string;
  createdBy: string;
  updatedAt: Date;
  folderUrl?: string;
  childrenCount?: number | null;
};

export const toFileRow = (file: FileEntity): FileRow => ({
  type: file.file ? 'file' : 'folder',
  id: file.id!,
  url: file.webUrl!,
  name: file.name!,
  createdBy: file.createdBy?.user?.displayName ?? '',
  updatedAt: new Date(file.lastModifiedDateTime ?? ''),
  folderUrl: file.folder
    ? `https://graph.microsoft.com/v1.0/sites/474b0b44-ccfa-4e1d-aae8-41e54af7c32c/drive/items/${file.id}/children`
    : '',
  childrenCount: file.folder?.childCount,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectFileTags = (file: FileEntity) =>
  createSelector(
    filesQuery.selectFileTags,
    (fileTags) => fileTags[file.id!] ?? [],
  );

export const selectFilesTableViewModel = createSelector(
  filesQuery.selectAll,
  tagsQuery.tagsFeature.selectTabTags,
  opportunitiesQuery.selectRouteOpportunityDetails,
  filesQuery.selectLoadedFolders,
  filesQuery.selectFileTags,
  (files, tags, opportunity, loadedFolders, fileTags) => {
    return {
      source: files
        .filter((t) => t.folderId === opportunity?.sharepointDirectoryId)
        .map(toFileRow),
      tags,
      opportunity,
      isLoading:
        !opportunity || !loadedFolders[opportunity.sharepointDirectoryId!],
      fileTags,
      rootFolder: opportunity?.sharepointDirectoryId,
    };
  },
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectFolderChildren = (folder: string) =>
  createSelector(
    filesQuery.selectAll,
    filesQuery.selectLoadedFolders,
    (files, loadingFolders) => {
      return {
        isLoaded: loadingFolders[folder],
        files: files.filter((file) => file.folderId === folder).map(toFileRow),
      };
    },
  );
@Component({
  selector: 'app-client-files-feature-files-table',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    BadgeComponent,
    FileTypeBadgeComponent,
    PickerComponent,
    PanelBarModule,
    TagComponent,
    UserTagDirective,
    DialogModule,
    FormFieldModule,
    MultiSelectModule,
    TextBoxModule,
    ReactiveFormsModule,
    LabelModule,
    TreeListModule,
  ],
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FilesTableComponent {
  @ViewChild(TreeListComponent)
  public treeList: TreeListComponent;

  public vm = this.store.selectSignal(selectFilesTableViewModel);
  public rootFolder = computed(() => this.vm().rootFolder ?? 'Root');

  public source = computed(() => this.vm().source, { equal: _.isEqual });

  public manageFileGroup = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    tags: new FormControl([] as TagData[]),
  });

  public activeFile: FileRow | null = null;

  public constructor(
    private store: Store,
    private actions$: Actions,
    private filesService: FilesService,
    private cdr: ChangeDetectorRef,
  ) {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['tab'] }),
    );
    this.store
      .select(opportunitiesQuery.selectRouteOpportunityDetails)
      .pipe(
        takeUntilDestroyed(),
        filter((o) => !!o),
      )
      .subscribe((opportunity) => {
        this.store.dispatch(
          FilesActions.getFiles({
            directoryUrl: opportunity!.sharePointDirectory!,
            folderId: opportunity!.sharepointDirectoryId!,
          }),
        );
      });

    this.actions$
      .pipe(ofType(FilesActions.updateFileTagsSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.activeFile = null;
        this.cdr.detectChanges();
      });
  }

  public getTagsSource(file: FileEntity): Observable<TagData[]> {
    return this.store.select(selectFileTags(file));
  }

  public trackBy: TrackByFunction<FileRow> = (index: number, item: FileRow) =>
    item.id;

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

    return this.store.select(selectFolderChildren(item.id)).pipe(
      filter((res) => res.isLoaded!),
      map((res) => res.files),
      first(),
    );
  };

  public removeTag(tag: TagData): void {
    const tags = this.manageFileGroup.controls.tags.value ?? [];
    this.manageFileGroup.controls.tags.setValue(
      tags.filter((t) => t.id !== tag.id),
    );
  }

  public openFileManage(file: FileRow): void {
    this.activeFile = file;
    this.manageFileGroup.controls.name.setValue(file.name);
    this.manageFileGroup.controls.tags.setValue(
      this.vm().fileTags[file.id] ?? [],
    ); //todo: get tags from file
  }
  public openFileWebUrl(file: FileRow): void {
    window.open(file.url, '_blank');
  }

  public updateFile(): void {
    if (!this.activeFile) return;

    this.store.dispatch(
      FilesActions.updateFileTags({
        opportunityId: this.vm().opportunity!.id,
        id: this.activeFile?.id,
        tags: this.manageFileGroup.controls.tags.value?.map((t) => t.id) ?? [],
      }),
    );
  }

  public onPickerChange(event: SPItem[]): void {
    const opportunity = this.vm().opportunity;
    if (!opportunity) return;

    const parentReference = {
      id: opportunity.sharepointDirectoryId!,
      driveId:
        'b!RAtLR_rMHU6q6EHlSvfDLAASJHjBXgVDjdZqm3u-M8xaIH4wn66DSb1tnKWcYlEx',
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
                directoryUrl: opportunity!.sharePointDirectory!,
                folderId: this.rootFolder(),
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

  public rowCallback = (context: RowClassArgs): Record<string, boolean> => {
    if (context.dataItem.type == 'folder') {
      return { 'folder-row': true };
    }
    return { 'file-row': true };
  };
}
