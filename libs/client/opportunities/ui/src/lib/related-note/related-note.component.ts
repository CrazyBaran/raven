import { trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteTypeBadgeComponent } from '@app/client/notes/ui';
import { TilelayoutItemComponent, delayedFadeIn } from '@app/client/shared/ui';
import { RecreateViewDirective } from '@app/client/shared/ui-directives';
import { SafeHtmlPipe } from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { RelatedNotesFooterComponent } from '../related-notes-footer/related-notes-footer.component';
import { RelatedNotesTableComponent } from '../related-notes-tables/related-notes-table.component';
import { CreateInfoComponent } from './create-info/create-info.component';

export interface RelatedNote {
  id: string;
  name: string;
  template: string;
  createdBy: string;
  updatedAt: Date | string | null;
  fields: { id: string; value: string; name: string }[];
}

@Component({
  selector: 'app-related-note',
  standalone: true,
  imports: [
    TilelayoutItemComponent,
    NoteTypeBadgeComponent,
    DatePipe,
    ButtonModule,
    RouterLink,
    SafeHtmlPipe,
    RelatedNotesFooterComponent,
    RecreateViewDirective,
    RelatedNotesTableComponent,
    CreateInfoComponent,
  ],
  templateUrl: './related-note.component.html',
  styleUrl: './related-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('delayedFadeIn', delayedFadeIn())],
})
export class RelatedNoteComponent {
  public pageChange = output<number>();

  public note = input.required<RelatedNote>();
  public page = input(0);
  public pageSize = input(0);

  protected onPageChange($event: number): void {
    this.pageChange.emit($event);
  }
}
