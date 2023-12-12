import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgxResizeObserverService } from './resize-service';
import { ResizedEvent } from './resized.event';

// directive cloned from ngx-resize-observer
@Directive({
  selector: '[appOnResize]',
  standalone: true,
  providers: [NgxResizeObserverService],
})
export class OnResizeDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public resizeBoxModel = '';

  @Output() public appOnResize = new EventEmitter<ResizedEvent>();

  private observing = false;

  private oldRect: DOMRectReadOnly;

  public constructor(
    private readonly elementRef: ElementRef,
    private readonly ngxResizeObserverService: NgxResizeObserverService,
  ) {}

  public ngAfterViewInit(): void {
    this.observe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.observing && (changes['resizeBoxModel'] || changes['onResize'])) {
      this.unobserve();
      this.observe();
    }
  }

  public ngOnDestroy(): void {
    this.unobserve();
  }

  private observe(): void {
    if (!this.observing) {
      this.ngxResizeObserverService.observe(
        this.elementRef.nativeElement,
        (resize) => {
          const resizedEvent = new ResizedEvent(
            resize.contentRect,
            this.oldRect,
          );
          this.oldRect = resize.contentRect;
          this.appOnResize.emit(resizedEvent);
        },
        this.resizeBoxModel,
      );
      this.observing = true;
    }
  }

  private unobserve(): void {
    if (this.observing) {
      this.ngxResizeObserverService.unobserve(this.elementRef.nativeElement);
      this.observing = false;
    }
  }
}
