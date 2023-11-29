import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FILE_TYPE_BADGE_COLORS,
  FileTypeBadgeColorsResolver,
  FileTypeBadgeComponent,
} from '@app/client/files/ui';
import { BadgeComponent, BadgeStyle } from '@app/client/shared/ui';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { PanelBarModule } from '@progress/kendo-angular-layout';
import { Observable, of } from 'rxjs';
import { PickerComponent } from '../picker/picker.component';

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
  ],
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: FILE_TYPE_BADGE_COLORS,
      useValue: {
        resolve: (): FileTypeBadgeColorsResolver => {
          const fileTypes: Record<string, BadgeStyle> = {
            'Company Material': {
              backgroundColor: '#e0e0e0',
              color: '#000000',
            },
            'Notes & Analysis': {
              backgroundColor: '#e0e0e0',
              color: '#000000',
            },
            'Market Research': {
              backgroundColor: '#e0e0e0',
              color: '#000000',
            },
          };

          return {
            resolve(fileType: string): Observable<BadgeStyle> {
              return of(fileTypes[fileType]);
            },
          };
        },
      },
    },
  ],
})
export class FilesTableComponent {
  public data: {
    folderName: string;
    files: { name: string; type: string; createdBy: string; updatedAt: Date }[];
  }[] = [
    {
      folderName: 'VDR',
      files: [
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

    {
      folderName: 'Research',
      files: [
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
    {
      folderName: 'Analysis',
      files: [
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
    {
      folderName: 'Legal/Tax',
      files: [
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
    {
      folderName: 'Output',
      files: [
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
}
