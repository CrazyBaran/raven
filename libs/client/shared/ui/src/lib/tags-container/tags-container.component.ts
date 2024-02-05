import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  OnResizeDirective,
  ResizedEvent,
} from '@app/client/shared/ui-directives';
import { calculateSize } from '@app/client/shared/util';
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
  imports: [
    TilesContainerComponent,
    TagComponent,
    TooltipModule,
    OnResizeDirective,
  ],
  templateUrl: './tags-container.component.html',
  styleUrls: ['./tags-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TagsContainerComponent {
  @Input() public rows = 1;
  @Input() public tags: TagItem[] = [];

  @Input() public width: number;

  public containerWidth = signal(0);

  public get tagsWidth(): number[] {
    return this.tags.map((t) => {
      const gap = 4;
      const icon = 12.25;
      const text = calculateSize(t.name, {
        fontSize: `${
          t.size === 'small' ? 11 : t.size === 'medium' ? 14 : 16
        }px`,
        font: 'interstate, sans-serif',
        fontWeight: '100',
      });
      return text.width + icon + gap;
    });
  }

  public trackByFn = (index: number, item: TagItem): string => item.id;

  public onContainerWidthChange($event: ResizedEvent): void {
    this.containerWidth.set($event.newRect.width);
  }
}
