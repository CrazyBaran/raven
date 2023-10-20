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

// directive cloned from ngx-resize-observer
@Directive({
  selector: '[appOnResize]',
  standalone: true,
})
export class OnResizeDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public resizeBoxModel = '';

  @Output() public appOnResize = new EventEmitter<ResizeObserverEntry>();

  private observing = false;

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
        (resize) => this.appOnResize.emit(resize),
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
