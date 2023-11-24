import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { PickerComponent } from '../picker/picker.component';

@Component({
  selector: 'app-client-files-feature-files-table',
  standalone: true,
  imports: [CommonModule, GridModule, ButtonModule, PickerComponent],
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesTableComponent {
  public data: {
    name: string;
    type: string;
    createdBy: string;
    updatedAt: Date;
  }[] = [
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
      //random date
      updatedAt: new Date('2021-01-01'),
    },
    //mock 5 more files
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
      //random date
      updatedAt: new Date('2021-05-01'),
    },
    {
      name: 'Company Bussiness Plan.docx',
      type: 'Company Material',
      createdBy: 'Virgile A',
      updatedAt: new Date('2022-05-01'),
    },
    {
      name: 'Notes.pdf',
      type: 'Market Research',
      createdBy: 'Virgile A',
      updatedAt: new Date('2022-08-06'),
    },
  ];
}
