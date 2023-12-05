import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilesService } from '@app/client/files/feature/data-access';
import { FilesActions, filesQuery } from '@app/client/files/feature/state';
import { SPItem } from '@app/client/files/sdk-pnptimeline';
import { FileTypeBadgeComponent } from '@app/client/files/ui';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  BadgeComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { Tag } from '@app/client/tags/data-access';
import { TagsActions, tagsQuery } from '@app/client/tags/state';
import { Actions, ofType } from '@ngrx/effects';
import { Store, createSelector } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormFieldModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  PanelBarExpandMode,
  PanelBarItemModel,
  PanelBarModule,
} from '@progress/kendo-angular-layout';
import { filter } from 'rxjs';
import { PickerComponent } from '../picker/picker.component';

type FileTypeItem = Omit<PanelBarItemModel, 'content'> & {
  content: {
    id: string;
    name: string;
    type?: string;
    createdBy: string;
    updatedAt: Date;
    url: string;
  }[];
};

export const selectFilesTableViewModel = createSelector(
  filesQuery.filesFeature.selectAll,
  tagsQuery.tagsFeature.selectTabTags,
  opportunitiesQuery.selectRouteOpportunityDetails,
  (files, tags, opportunity) => ({
    data: files.reduce<FileTypeItem[]>((acc, file) => {
      const folderName = file.parentReference?.name ?? 'Root';
      const folder = acc.find((f) => f.title === folderName);
      if (folder) {
        folder.content.push({
          id: file.id,
          url: file.webUrl,
          name: file.name,
          createdBy: file.createdBy?.user?.displayName ?? '',
          updatedAt: new Date(file.lastModifiedDateTime ?? ''),
        });
      } else {
        acc.push(<FileTypeItem>{
          title: folderName,
          iconClass: 'fa-regular fa-folder mr-2',
          content: [
            {
              name: file.name,
              createdBy: file.createdBy?.user?.displayName ?? '',
              updatedAt: new Date(file.lastModifiedDateTime ?? ''),
              id: file.id,
              url: file.webUrl,
            },
          ],
        });
      }
      return acc;
    }, []),
    tags,
    opportunity,
  }),
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
  ],
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesTableComponent {
  public vm = this.store.selectSignal(selectFilesTableViewModel);

  public manageFileGroup = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    tags: new FormControl([] as Tag[]),
  });

  public panelExapndMode = PanelBarExpandMode.Single;

  public activeFile: FileTypeItem['content'][number] | null = null;

  public constructor(
    private store: Store,
    private actions$: Actions,
    private filesService: FilesService,
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
          }),
        );
      });

    this.store
      .select(selectFilesTableViewModel)
      .subscribe((res) => console.log(res));

    this.actions$
      .pipe(ofType(FilesActions.updateFileTagsSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.activeFile = null;
      });
  }

  public removeTag(tag: Tag): void {
    const tags = this.manageFileGroup.controls.tags.value ?? [];
    this.manageFileGroup.controls.tags.setValue(
      tags.filter((t) => t.id !== tag.id),
    );
  }

  public openFileManage(file: FileTypeItem['content'][number]): void {
    this.activeFile = file;
    this.manageFileGroup.controls.name.setValue(file.name);
    this.manageFileGroup.controls.tags.setValue([]); //todo: get tags from file
  }
  public openFileWebUrl(file: FileTypeItem['content'][number]): void {
    window.open(file.url, '_blank');
  }

  public updateFile(): void {
    if (!this.activeFile) return;

    this.store.dispatch(
      FilesActions.updateFileTags({
        opportunityId: this.vm().opportunity!.id,
        id: this.activeFile?.id,
        tags:
          this.manageFileGroup.controls.tags.value?.map((t: Tag) => t.id) ?? [],
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
          this.store.dispatch(
            FilesActions.getFiles({
              directoryUrl: opportunity!.sharePointDirectory!,
            }),
          );
        });
    });
  }
}
