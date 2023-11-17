/* eslint-disable @typescript-eslint/explicit-member-accessibility,@typescript-eslint/no-explicit-any,@typescript-eslint/member-ordering */
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { maxVisibleIndex } from '@app/client/shared/util';
import { BehaviorSubject, combineLatest, distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  OnResizeDirective,
  ResizedEvent,
} from '@app/client/shared/ui-directives';

@Component({
  selector: 'ui-tiles-container',
  standalone: true,
  imports: [CommonModule, ObserversModule, OnResizeDirective],
  templateUrl: './tiles-container.component.html',
  styleUrls: ['./tiles-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TilesContainerComponent {
  readonly containerWidth$ = new BehaviorSubject<number>(0);
  readonly tilesLength$ = new BehaviorSubject<number[]>([]);
  readonly tooltipTileWidth$ = new BehaviorSubject<number>(0);

  @Input() set tiles(value: any[]) {
    this.tilesSignal.set(value);
  }

  @Input() itemTemplate!: TemplateRef<any>;

  @Input() tooltipTemplate!: TemplateRef<any>;

  @ViewChild('placeholder', { read: ElementRef, static: true })
  placeholder!: ElementRef;

  readonly maxVisibleIndex$ = combineLatest([
    this.containerWidth$,
    this.tilesLength$,
    this.tooltipTileWidth$,
  ]).pipe(
    map(([width, tilesLength, tooltipWidth]) => {
      return maxVisibleIndex(width, tilesLength, tooltipWidth);
    }),
    distinctUntilChanged(),
  );

  tilesSignal = signal<string[]>([]);
  maxIndexSignal = toSignal(this.maxVisibleIndex$);
  hiddenTilesLengthSignal = computed(
    () => this.tilesSignal().length - this.maxIndexSignal()! - 1,
  );

  onContainerWidthChange(event: ResizedEvent): void {
    this.containerWidth$.next(event.newRect.width);
  }

  onTileListWidthChange(): void {
    this.tilesLength$.next(this._getTilesWidth());
  }

  onTooltipTileWidthChange($event: ResizedEvent): void {
    this.tooltipTileWidth$.next(
      Math.round($event.newRect.width) + Math.floor(Math.random() * 10),
    );
  }

  private _getTilesWidth(): number[] {
    return Array.from(this.placeholder.nativeElement.childNodes)
      .filter((el: any) => {
        return el.className?.includes('tile-list');
      })
      .map((el: any) => el.offsetWidth);
  }
}
