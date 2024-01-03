import {
  ChangeDetectorRef,
  Directive,
  inject,
  Pipe,
  PipeTransform,
} from '@angular/core';
// TODO: fix colors boundaries
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TagType } from '@app/rvns-tags';
import { TagComponent } from './tag.component';

@Directive({
  selector: 'ui-tag [uiUserTag]',
  standalone: true,
})
export class UserTagDirective {
  private cd = inject(ChangeDetectorRef);

  private tagComponent = inject(TagComponent);

  public constructor() {
    this.tagComponent.icon = 'fa-solid fa-circle-user';
    // this.tagComponent.removable = false;
    // this.tagComponent.clickable = false;
    this.cd.markForCheck();
  }
}

export const tagTypeStyleDictionary: Record<TagType, Record<string, string>> = {
  general: {
    color: '#5a5a5a',
  },
  people: {
    color: 'var(--series-b)',
  },
  company: {
    color: 'var(--series-f)',
  },
  opportunity: {
    color: 'var(--series-f)',
  },
  industry: {
    color: 'var(--series-d-darken-75)',
  },
  investor: {
    color: 'var(--series-e-darken-75)',
  },
  'business-model': {
    color: 'var(--series-a-darken-75)',
  },
  tab: {
    color: '#5a5a5a',
  },
};

@Pipe({
  name: 'tagTypeColor',
  standalone: true,
})
export class TagTypeColorPipe implements PipeTransform {
  public transform(
    type: string | undefined,
  ): Record<string, string> | undefined {
    if (!type) return undefined;
    return tagTypeStyleDictionary[type as TagType];
  }
}
