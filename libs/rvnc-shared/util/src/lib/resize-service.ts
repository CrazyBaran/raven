import { Injectable, NgZone, OnDestroy } from '@angular/core';

export interface ResizeObserverBoxSize {
  blockSize: number; // height if horizontal writing mode, width otherwise
  inlineSize: number; // width if horizontal writing mode, height otherwise
}

export type ResizeObserverCallback = (
  resizes: ResizeObserverEntry[],
  observer: ResizeObserver,
) => void;

export interface ResizeObserverConfig {
  box?: 'content-box' | 'border-box';
}

export type ResizeObserverServiceCallback = (
  resize: ResizeObserverEntry,
) => void;

@Injectable()
export class NgxResizeObserverService implements OnDestroy {
  private count = 0;
  private elementMap = new Map<Element, ResizeObserverServiceCallback>();
  private observer: ResizeObserver | null = null;

  public constructor(private readonly ngZone: NgZone) {}

  public ngOnDestroy(): void {
    if (this.observer) {
      this.clearObserver();
    }
  }

  public observe(
    element: Element,
    callback: ResizeObserverServiceCallback,
    boxModel: string,
  ): void {
    if (!this.observer) {
      this.observer = new ResizeObserver((resizes) => {
        for (const resize of resizes) {
          const cb = this.elementMap.get(resize.target);

          if (cb) {
            this.ngZone.run(() => {
              cb(resize);
            });
          }
        }
      });
    }

    if (boxModel === 'border-box') {
      this.observer.observe(element, {
        box: 'border-box',
      });
    } else {
      this.observer.observe(element);
    }

    this.count += 1;
    this.elementMap.set(element, callback);
  }

  public unobserve(element: Element): void {
    const cb = this.elementMap.get(element);

    if (cb && this.observer) {
      this.observer.unobserve(element);
      this.elementMap.delete(element);
      this.count -= 1;

      if (this.count === 0) {
        this.clearObserver();
      }
    }
  }

  private clearObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = null;
    this.count = 0;
    this.elementMap = new Map<Element, ResizeObserverServiceCallback>();
  }
}
