import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TagItem, TagsContainerComponent } from '@app/client/shared/ui';
import { DynamicColumnBase } from '../dynamic-column-base.directive';

@Component({
  standalone: true,
  selector: 'app-dynamic-string-column',
  templateUrl: './dynamic-tags-column.component.html',
  styleUrls: ['./dynamic-tags-column.component.scss'],
  imports: [TagsContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTagsColumnComponent extends DynamicColumnBase<string[]> {
  public get tags(): TagItem[] {
    return (
      this.field?.map((tag) => ({
        name: tag,
        icon: 'fa-solid fa-tag',
        id: tag,
        size: 'small',
      })) ?? []
    );
  }
}
