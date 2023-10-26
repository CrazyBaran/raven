import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[truncateElements]',
  standalone: true,
})
export class TruncateElementsDirective implements AfterViewInit {
  @Input() public gap = 0;
  @Input() public suffixInfo = '';

  private hiddenItemsText: string;

  public constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
  ) {}

  public ngAfterViewInit(): void {
    const availableWidth = this.elementRef.nativeElement.clientWidth;
    const childElements = this.elementRef.nativeElement.children;

    if (
      childElements.length &&
      this._shouldTruncate(childElements, availableWidth)
    ) {
      const visibleItems = this._calculateVisibleItems(
        childElements,
        availableWidth,
      );

      if (visibleItems === childElements.length) {
        return;
      }

      this.hiddenItemsText = `+${childElements.length - visibleItems} ${
        this.suffixInfo
      }`;

      this._hideExcessItems(childElements, visibleItems);
      this._renderHiddenItemsInfo();
    }
  }

  private _shouldTruncate(
    items: HTMLCollectionOf<HTMLElement>,
    availableWidth: number,
  ): boolean {
    const itemsArray = Array.from(items);
    let totalWidth = 0;

    for (const [idx, element] of itemsArray.entries()) {
      totalWidth += element.offsetWidth + (idx !== 0 ? this.gap : 0);
      if (totalWidth > availableWidth) {
        return true;
      }
    }

    return false;
  }

  private _calculateVisibleItems(
    items: HTMLCollectionOf<HTMLElement>,
    availableWidth: number,
  ): number {
    const itemsArray = Array.from(items);
    let totalWidth = 0;

    for (const [idx, element] of itemsArray.entries()) {
      totalWidth += element.offsetWidth + (idx !== 0 ? this.gap : 0);

      if (totalWidth > availableWidth) {
        return idx > 0 ? idx : 1;
      }
    }

    return items.length;
  }

  private _hideExcessItems(
    items: HTMLCollectionOf<HTMLElement>,
    visibleItems: number,
  ): void {
    for (let i = visibleItems; i < items.length; i++) {
      this.renderer.setStyle(items[i], 'display', 'none');
    }
  }

  private _renderHiddenItemsInfo(): void {
    const hideItemsInfo = this.renderer.createElement('span');

    this.renderer.appendChild(
      hideItemsInfo,
      this.renderer.createText(this.hiddenItemsText),
    );
    this.renderer.addClass(hideItemsInfo, 'text-grey-600');

    this.renderer.appendChild(this.elementRef.nativeElement, hideItemsInfo);
  }
}
