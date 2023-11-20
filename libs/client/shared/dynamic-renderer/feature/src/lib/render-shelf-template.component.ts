import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ComponentTemplate,
  DynamicComponentsService,
  LoadedRenderItems,
} from '@app/client/shared/dynamic-renderer/data-access';
import { LoaderComponent } from '@app/client/shared/ui';
import { WindowModule, WindowRef } from '@progress/kendo-angular-dialog';

@Directive()
export abstract class ShelfTemplateBase {
  public abstract get windowTitleBarRef(): TemplateRef<unknown>;
}

@Component({
  selector: 'app-render-shelf-template',
  template: `
    <ui-loader *ngIf="!componentRef && component.showLoading"></ui-loader>
    <ng-template #container></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LoaderComponent, NgIf, WindowModule, NgTemplateOutlet],
  providers: [DynamicComponentsService],
})
export class RenderShelfTemplateComponent<T extends ShelfTemplateBase>
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) public component: ComponentTemplate;

  @ViewChild('container', { read: ViewContainerRef })
  protected container: ViewContainerRef;

  protected componentRef: ComponentRef<T> | undefined = undefined;

  public constructor(
    private cdr: ChangeDetectorRef,
    private dynamicComponentsService: DynamicComponentsService,
    private windowRef: WindowRef,
  ) {}

  public get properties(): T | undefined {
    return this.componentRef?.instance;
  }

  public ngOnDestroy(): void {
    this.componentRef?.destroy();

    if (this.container) {
      this.container.clear();
    }
  }

  public async ngAfterViewInit(): Promise<void> {
    if (!this.container || !this.component) {
      return;
    }

    this.componentRef?.destroy();

    const itemRef =
      await this.dynamicComponentsService.loadComponentConstructor(
        this.component,
      );

    this.container?.clear();

    this.renderComponent({
      renderItemRef: itemRef,
      componentTemplate: this.component,
    });
  }

  private renderComponent(item: LoadedRenderItems): void {
    const newComponent = this.dynamicComponentsService.createComponent(
      this.container,
      item.componentTemplate,
      item.renderItemRef,
    );

    if (newComponent) {
      this.componentRef = newComponent;
    }

    if (this.componentRef?.instance?.windowTitleBarRef) {
      this.windowRef.window.instance.titleBarTemplate =
        this.componentRef?.instance?.windowTitleBarRef;
      this.windowRef.window.changeDetectorRef.detectChanges();
    }

    this.cdr.markForCheck();
  }
}
