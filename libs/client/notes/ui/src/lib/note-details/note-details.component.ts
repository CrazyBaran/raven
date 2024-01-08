import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  TagComponent,
  TagTypeColorPipe,
  UserTagDirective,
} from '@app/client/shared/ui';
import {
  PopulateAzureImagesPipe,
  SafeHtmlPipe,
} from '@app/client/shared/ui-pipes';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { RxLet } from '@rx-angular/template/let';
import { NoteTypeBadgeComponent } from '../note-type-badge/note-type-badge.component';

export interface NoteDetails {
  name: string;
  templateName: string;
  createdBy: {
    name: string;
  };
  tags: { id: string; name: string; type: string }[];
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [
    TagComponent,
    ButtonModule,
    ExpansionPanelModule,
    SafeHtmlPipe,
    PopulateAzureImagesPipe,
    TagTypeColorPipe,
    UserTagDirective,
    RxLet,
    NoteTypeBadgeComponent,
  ],
  templateUrl: './note-details.component.html',
  styleUrl: './note-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailsComponent {
  @Input({ required: true }) public noteDetails: NoteDetails;
  @Input() public fields: { id: string; name: string }[] = [];
  @Input() public noteFields: { id: string; value: string; name: string }[] =
    [];

  protected get personTags(): { id: string; name: string; type: string }[] {
    return this.noteDetails.tags.filter((tag) => tag.type === 'people');
  }

  protected get notPersonTags(): { id: string; name: string; type: string }[] {
    return this.noteDetails.tags.filter((tag) => tag.type !== 'people');
  }

  protected handleScrollToField(fieldId: string): void {
    document.getElementById(fieldId)?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
