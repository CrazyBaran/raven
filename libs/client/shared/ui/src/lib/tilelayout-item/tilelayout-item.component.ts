/* eslint-disable @typescript-eslint/member-ordering,@typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  TemplateRef,
  input,
} from '@angular/core';

@Component({
  selector: 'ui-tilelayout-item',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './tilelayout-item.component.html',
  styleUrls: ['./tilelayout-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TilelayoutItemComponent {
  @ContentChild('header', { read: TemplateRef })
  public header: TemplateRef<any>;

  @ContentChild('content', { read: TemplateRef })
  public content: TemplateRef<any>;

  public printMode = input<boolean>(false);
}
