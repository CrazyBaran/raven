/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ENVIRONMENT, Environment } from '@app/client/core/environment';
import { SharepointHelperService } from '@app/client/files/feature/data-access';
import {
  FileEntity,
  FilesActions,
  filesQuery,
} from '@app/client/files/feature/state';
import { FileTypeBadgeComponent } from '@app/client/files/ui';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  BadgeComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { OpenInNewTabDirective } from '@app/client/shared/ui-directives';
import { DropdownNavigationComponent } from '@app/client/shared/ui-router';
import { QuickFiltersTemplateComponent } from '@app/client/shared/ui-templates';
import {
  buildDropdownNavigation,
  buildPageParamsSelector,
  selectQueryParam,
} from '@app/client/shared/util-router';
import { TagsActions, tagsQuery } from '@app/client/tags/state';
import { TagData } from '@app/rvns-tags';
import { Actions, ofType } from '@ngrx/effects';
import { Store, createSelector } from '@ngrx/store';
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
import { Observable, combineLatest, filter, first, map, startWith } from 'rxjs';
import { PickerContainerComponent } from '../picker-container/picker-container.component';

const opportunityFilesQueryParams = ['tag'] as const;

export const selectOrganisationsTableParams = buildPageParamsSelector(
  opportunityFilesQueryParams,
);

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

const toFileRow =
  (environment: Environment) =>
  (file: FileEntity): FileRow => ({
    type: file.file ? 'file' : 'folder',
    id: file.id!,
    url: file.webUrl!,
    name: file.name!,
    createdBy: file.createdBy?.user?.displayName ?? '',
    updatedAt: new Date(file.lastModifiedDateTime ?? ''),
    folderUrl: file.folder
      ? `https://graph.microsoft.com/v1.0/sites/${environment.sharepointSiteId}/drives/${environment.sharepointDriveId}/items/${file.id}/children`
      : '',
    childrenCount: file.folder?.childCount,
  });

export const selectFileTags = (file: FileEntity) =>
  createSelector(
    filesQuery.selectFilesTags,
    (fileTags) => fileTags[file.id!] ?? [],
  );

export const selectFilesTableViewModelFactory = (environment: Environment) =>
  createSelector(
    filesQuery.selectAll,
    tagsQuery.tagsFeature.selectTabTags,
    opportunitiesQuery.selectRouteOpportunityDetails,
    filesQuery.selectLoadedFolders,
    filesQuery.selectFilesTags,
    selectOrganisationsTableParams,
    opportunitiesQuery.selectIsTeamMemberForCurrentOpportunity,
    selectQueryParam('tag'),
    filesQuery.selectFilteredFilesByTags,
    opportunitiesQuery.selectOpportunityTemplateTabs,
    (
      files,
      tags,
      opportunity,
      loadedFolders,
      fileTags,
      params,
      isTeamMember,
      tag,
      filteredFilesByTags,
      opportunityTemplateTabs,
    ) => {
      return {
        source: files
          .filter((t) => t.folderId === opportunity?.sharepointDirectoryId)
          .map(toFileRow(environment)),
        tags: tags.filter((tag) =>
          opportunityTemplateTabs.some((t) => t.id === tag.tabId),
        ),
        opportunity,
        isLoading:
          !opportunity || !loadedFolders[opportunity.sharepointDirectoryId!],
        fileTags,
        sharepointFolder: opportunity?.sharePointPath,
        rootFolder: opportunity?.sharepointDirectoryId,
        canEditFiles: isTeamMember,
        filters: buildDropdownNavigation({
          params,
          name: 'tag',
          data: tags.map((t) => ({ name: t.name, id: t.id })),
          loading: false,
          defaultItem: {
            name: 'All Files',
            id: null,
          },
        }),
        tag,
        filteredFilesByTags:
          opportunity && tag
            ? filteredFilesByTags[opportunity.id + tag]?.map(
                toFileRow(environment),
              )
            : undefined,
      };
    },
  );

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectFolderChildrenFactory =
  (environment: Environment) => (folder: string) =>
    createSelector(
      filesQuery.selectAll,
      filesQuery.selectLoadedFolders,
      (files, loadingFolders) => {
        return {
          isLoaded: loadingFolders[folder],
          files: files
            .filter((file) => file.folderId === folder)
            .map(toFileRow(environment)),
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
    PickerContainerComponent,
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
    DropdownNavigationComponent,
    QuickFiltersTemplateComponent,
    RouterOutlet,
    NgClass,
    OpenInNewTabDirective,
  ],
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FilesTableComponent {
  @ViewChild(TreeListComponent)
  public treeList: TreeListComponent;

  public environment = inject(ENVIRONMENT);
  public sharepointHelper = inject(SharepointHelperService);

  public vm = this.store.selectSignal(
    selectFilesTableViewModelFactory(this.environment),
  );
  public rootFolder = computed(() => this.vm().rootFolder ?? 'Root');

  public source = computed(() => this.vm().source, { equal: _.isEqual });

  public filters = computed(() => this.vm().filters, { equal: _.isEqual });

  public manageFileGroup = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    tags: new FormControl([] as TagData[]),
  });

  public activeFile: FileRow | null = null;

  public constructor(
    private store: Store,
    private actions$: Actions,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
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

    combineLatest([
      this.store.select(opportunitiesQuery.selectRouteOpportunityDetails),
      this.route.queryParams,
    ])
      .pipe(
        startWith([undefined, this.route.snapshot.queryParams] as const),
        takeUntilDestroyed(),
      )
      .subscribe(([opportunity, params]) => {
        if (opportunity && params['tag']) {
          this.store.dispatch(
            FilesActions.getFilesByTags({
              directoryUrl: opportunity.sharePointDirectory!,
              opportunityId: opportunity.id,
              tags: [params['tag']],
            }),
          );
        }
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

    return this.store
      .select(selectFolderChildrenFactory(this.environment)(item.id))
      .pipe(
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

  public rowCallback = (context: RowClassArgs): Record<string, boolean> => {
    if (context.dataItem.type == 'folder') {
      return { 'folder-row': true };
    }
    return { 'file-row': true };
  };

  public sharepointUrl(): string {
    return this.sharepointHelper.getSharepointUrl(
      this.vm()?.opportunity?.sharePointPath,
    );
  }
}
