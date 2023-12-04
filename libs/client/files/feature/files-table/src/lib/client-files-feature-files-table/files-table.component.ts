import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileTypeBadgeComponent } from '@app/client/files/ui';
import {
  BadgeComponent,
  TagComponent,
  UserTagDirective,
} from '@app/client/shared/ui';
import { Store } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import {
  PanelBarExpandMode,
  PanelBarItemModel,
  PanelBarModule,
} from '@progress/kendo-angular-layout';
import { OneDrivePickerComponent } from '../one-drive-picker/one-drive-picker.component';
import { PickerComponent } from '../picker/picker.component';

type FileTypeItem = {
  folderName: string;
  files: { name: string; type: string; createdBy: string; updatedAt: Date }[];
};

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
    OneDrivePickerComponent,
  ],
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesTableComponent {
  public panelExapndMode = PanelBarExpandMode.Single;

  public data: PanelBarItemModel[] = [
    <PanelBarItemModel>{
      iconClass: 'fa-regular fa-folder mr-2',
      title: 'VDR',
      content: [
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Company Material',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-01-01'),
        },
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Market Research',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-05-01'),
        },
      ],
    },

    <PanelBarItemModel>{
      iconClass: 'fa-regular fa-folder mr-2',
      title: 'Research',
      content: [
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Company Material',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-01-01'),
        },
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Market Research',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-05-01'),
        },
      ],
    },
    <PanelBarItemModel>{
      iconClass: 'fa-regular fa-folder mr-2',
      title: 'Analysis',
      content: [
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Company Material',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-01-01'),
        },
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Market Research',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-05-01'),
        },
      ],
    },
    <PanelBarItemModel>{
      iconClass: 'fa-regular fa-folder mr-2',
      title: 'Legal/Tax',
      content: [
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Company Material',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-01-01'),
        },
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Market Research',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-05-01'),
        },
      ],
    },
    <PanelBarItemModel>{
      iconClass: 'fa-regular fa-folder mr-2',
      title: 'Output',
      content: [
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Company Material',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-01-01'),
        },
        {
          name: 'Company Bussiness Plan.docx',
          type: 'Market Research',
          createdBy: 'Virgile A',
          updatedAt: new Date(),
        },
        {
          name: 'Notes.pdf',
          type: 'Notes & Analysis',
          createdBy: 'Virgile A',
          updatedAt: new Date('2021-05-01'),
        },
      ],
    },
  ];

  public constructor(private store: Store) {
    // this.store.dispatch(TagsActions.getTagsByTypesIfNotLoaded({tagTypes:['file']}))
  }
}
