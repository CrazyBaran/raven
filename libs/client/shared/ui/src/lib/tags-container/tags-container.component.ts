import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonSize } from '@progress/kendo-angular-buttons';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { TagComponent } from '../tag/tag.component';
import { TilesContainerComponent } from '../tiles-container/tiles-container.component';

export interface TagItem {
  id: string;
  name: string;
  style?: Record<string, string | undefined | boolean>;
  icon: string;
  size: ButtonSize;
}

@Component({
  selector: 'ui-tags-container',
  standalone: true,
  imports: [TilesContainerComponent, TagComponent, TooltipModule],
  templateUrl: './tags-container.component.html',
  styleUrls: ['./tags-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TagsContainerComponent {
  @Input() public rows = 1;
  @Input() public tags: TagItem[] = [];

  public trackByFn = (index: number, item: TagItem): string => item.id;
}
