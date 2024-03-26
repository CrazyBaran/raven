import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TilelayoutItemComponent } from '@app/client/shared/ui';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { TileLayoutModule } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-note-field-skeleton',
  standalone: true,
  imports: [SkeletonModule, TileLayoutModule, TilelayoutItemComponent],
  templateUrl: './note-field-skeleton.component.html',
  styleUrl: './note-field-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteFieldSkeletonComponent {}
