import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoteTypeBadgeComponent } from '@app/client/notes/ui';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { SafeHtmlPipe } from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { RelatedNotesFooterComponent } from '../related-notes-footer/related-notes-footer.component';

@Component({
  selector: 'app-related-note-skeleton',
  standalone: true,
  imports: [
    SkeletonModule,
    ButtonModule,
    DatePipe,
    NoteTypeBadgeComponent,
    RelatedNotesFooterComponent,
    SafeHtmlPipe,
    TilelayoutItemComponent,
  ],
  templateUrl: './related-note-skeleton.component.html',
  styleUrl: './related-note-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedNoteSkeletonComponent {}
