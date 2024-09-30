import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  TrackByFunction,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ENVIRONMENT, Environment } from '@app/client/core/environment';
import { FilesService } from '@app/client/files/feature/data-access';
import { FileEntity, filesQuery } from '@app/client/files/feature/state';
import { TagComponent, UserTagDirective } from '@app/client/shared/ui';
import {
  OpenInNewTabDirective,
  ShowTooltipIfClampedDirective,
} from '@app/client/shared/ui-directives';
import { tapResponse } from '@ngrx/component-store';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import {
  TreeListComponent,
  TreeListItem,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { Observable, map, of, pipe, switchMap, tap } from 'rxjs';
import { FileTagsUpdateDialogComponent } from '../file-tags-update-dialog/file-tags-update-dialog.component';

type FileRow = {
  type: 'file' | 'folder';
  id: string;
  url: string;
  name: string;
  createdBy: string;
  updatedAt: Date;
  folderId: string;
  tags$?: Observable<{ name: string; id: string }[]>;
  folderUrl?: string;
  childrenCount?: number | null;
};

export type FileTreeListState = {
  loading: boolean;
  tab: string | undefined;
  directoryUrl: string | undefined;
};

export const toFileRow =
  (environment: Environment, store: Store) =>
  (file: FileEntity): FileRow => ({
    type: file.file ? 'file' : 'folder',
    id: file.id!,
    url: file.webUrl!,
    name: file.name!,
    createdBy: file.createdBy?.user?.displayName ?? '',
    updatedAt: new Date(file.lastModifiedDateTime ?? ''),
    folderId: file.folderId!,
    tags$: store.select(filesQuery.selectFileTags(file.id!)),
    folderUrl: file.folder
      ? `https://graph.microsoft.com/v1.0/sites/${environment.sharepointSiteId}/drives/${environment.sharepointDriveId}/items/${file.id}/children`
      : '',
    childrenCount: file.folder?.childCount,
  });

export const fileTreeListStore = signalStore(
  withState<FileTreeListState>({
    loading: false,
    tab: undefined,
    directoryUrl: undefined,
  }),
  withEntities<FileRow>(),
  withComputed(
    (
      store,
      filesService = inject(FilesService),
      environment = inject(ENVIRONMENT),
      ngrxStore = inject(Store),
    ) => ({
      rootParams: computed(() => ({
        directoryUrl: store.directoryUrl(),
        tab: store.tab(),
      })),
      fetchChildren: computed((): TreeListComponent['fetchChildren'] => {
        return (item: FileRow) =>
          filesService
            .getFiles({ directoryUrl: item.folderUrl! })
            .pipe(
              map((response) =>
                response.map(toFileRow(environment, ngrxStore)),
              ),
            );
      }),
    }),
  ),
  withMethods(
    (
      store,
      filesService = inject(FilesService),
      environment = inject(ENVIRONMENT),
      ngrxStore = inject(Store),
    ) => ({
      setDirectoryUrl: rxMethod<string>(
        tap((directoryUrl) => {
          patchState(store, { directoryUrl });
        }),
      ),
      setTab: rxMethod<string | undefined>(
        tap((tab) => {
          patchState(store, { tab });
        }),
      ),
      loadRootFolder: rxMethod<{
        directoryUrl: string | undefined;
        tab: string | undefined;
      }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ directoryUrl, tab }) =>
            directoryUrl
              ? filesService.getFiles({ directoryUrl }).pipe(
                  tapResponse({
                    next: (value) => {
                      const files = value.map(
                        toFileRow(environment, ngrxStore),
                      );
                      patchState(store, setEntities(files));
                    },
                    error: console.error,
                    finalize: () => patchState(store, { loading: false }),
                  }),
                )
              : of([]),
          ),
        ),
      ),
    }),
  ),
  withHooks((store) => ({
    onInit(): void {
      const params = store.rootParams;
      store.loadRootFolder(params);
    },
  })),
);

@Component({
  selector: 'app-files-treelist-container',
  standalone: true,
  imports: [
    TreeListModule,
    NgClass,
    TagComponent,
    ButtonModule,
    RxPush,
    AsyncPipe,
    RxLet,
    RouterLink,
    UserTagDirective,
    FileTagsUpdateDialogComponent,
    TooltipModule,
    ShowTooltipIfClampedDirective,
    OpenInNewTabDirective,
  ],
  templateUrl: './files-treelist-container.component.html',
  styleUrl: './files-treelist-container.component.scss',
  providers: [fileTreeListStore],
})
export class FilesTreelistContainerComponent {
  public store = inject(fileTreeListStore);

  public canEditFiles = input<boolean>();
  public directoryUrl = input.required<string>();
  public tab = input<string>();

  public activeFile = signal<FileRow | null>(null);

  public constructor() {
    this.store.setDirectoryUrl(this.directoryUrl);
  }

  public rowCallback = (context: RowClassArgs): Record<string, boolean> => {
    if (context.dataItem.type == 'folder') {
      return { 'folder-row': true };
    }
    return { 'file-row': true };
  };

  public trackBy: TrackByFunction<TreeListItem> = (
    index: number,
    item: TreeListItem,
  ) => ('id' in item.data ? item.data.id : item.data);

  public hasChildren = (item: FileRow): boolean => {
    return item.type === 'folder' && item.childrenCount! > 0;
  };
}
