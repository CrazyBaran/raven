import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilesActions, filesQuery } from '@app/client/files/feature/state';
import { FileTypeBadgeComponent } from '@app/client/files/ui';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import {
  BadgeComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { Tag } from '@app/client/tags/data-access';
import { TagsActions, tagsQuery } from '@app/client/tags/state';
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

type FileTypeItem = {
  iconClass: string;
  title: string;
  content: {
    id: string;
    name: string;
    type?: string;
    createdBy: string;
    updatedAt: Date;
  }[];
};

export const selectFilesTableViewModel = createSelector(
  filesQuery.filesFeature.selectAll,
  tagsQuery.tagsFeature.selectOpportunityTags,
  (files, tags) => ({
    data: files.reduce<PanelBarItemModel[]>((acc, file) => {
      const folderName = file.parentReference?.name ?? 'Root';
      const folder = acc.find((f) => f.title === folderName);
      if (folder) {
        folder.content.push({
          name: file.name,
          createdBy: file.createdBy?.user?.displayName ?? '',
          updatedAt: new Date(file.lastModifiedDateTime ?? ''),
        });
      } else {
        acc.push(<PanelBarItemModel>{
          title: folderName,
          iconClass: 'fa-regular fa-folder mr-2',
          content: [
            {
              name: file.name,
              createdBy: file.createdBy?.user?.displayName ?? '',
              updatedAt: new Date(file.lastModifiedDateTime ?? ''),
              id: file.id,
            },
          ],
        });
      }
      return acc;
    }, []),
    tags,
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

  public constructor(private store: Store) {
    this.store.dispatch(
      TagsActions.getTagsByTypesIfNotLoaded({ tagTypes: ['opportunity'] }),
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

  public updateFile(): void {
    if (!this.activeFile) return;

    // this.store.dispatch(FilesActions.updateFile({
    //   id: this.activeFile?.id,
    //   tags: this.manageFileGroup.controls.tags.value?.map((t: Tag) => t.id),
    // }))
  }
}
