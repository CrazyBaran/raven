/* eslint-disable @typescript-eslint/explicit-member-accessibility,@typescript-eslint/no-explicit-any,@typescript-eslint/member-ordering */
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { OnResizeDirective } from '@app/client/shared/ui-directives';
import { maxVisibleIndex } from '@app/client/shared/util';

@Component({
  selector: 'ui-tiles-container',
  standalone: true,
  imports: [CommonModule, ObserversModule, OnResizeDirective],
  templateUrl: './tiles-container.component.html',
  styleUrls: ['./tiles-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TilesContainerComponent {
  public tiles = input.required<any[]>();
  public rows = input<number>();
  public staticContainerWidth = input.required<number>();
  public staticTooltipWidth = input.required<number>();
  public staticTilesWidth = input.required<number[]>();

  @Input({ required: true }) itemTemplate!: TemplateRef<any>;

  @Input({ required: true }) tooltipTemplate!: TemplateRef<any>;

  @Input({ required: true }) trackBy!: (index: number, item: any) => any;

  @Input() delimeter = '';

  @ViewChild('placeholder', { read: ElementRef, static: true })
  placeholder!: ElementRef;

  maxIndexSignal = computed(() =>
    maxVisibleIndex(
      this.staticContainerWidth(),
      this.staticTilesWidth(),
      this.staticTooltipWidth(),
      this.rows(),
    ),
  );

  hiddenTilesLengthSignal = computed(
    () => this.tiles().length - this.maxIndexSignal()! - 1,
  );
}
