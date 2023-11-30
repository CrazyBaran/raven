import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-related-notes-table',
  standalone: true,
  imports: [CommonModule, GridModule, ButtonsModule, RouterLink],
  templateUrl: './related-notes-table.component.html',
  styleUrls: ['./related-notes-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RelatedNotesTableComponent {
  @Input() public notes: unknown[];

  public sort: SortDescriptor[] = [
    {
      field: 'updatedAt',
      dir: 'desc',
    },
  ];
}
