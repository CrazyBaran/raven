import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { TilesContainerComponent } from '../tiles-container/tiles-container.component';

@Component({
  selector: 'ui-tags-container',
  standalone: true,
  imports: [TilesContainerComponent, TagComponent],
  templateUrl: './tags-container.component.html',
  styleUrls: ['./tags-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsContainerComponent {
  @Input() public tags: string[] = [];
}
