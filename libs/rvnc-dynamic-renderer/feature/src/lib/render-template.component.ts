import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { NgIf } from '@angular/common';
import { LoaderComponent } from '@app/rvnc-core-ui';
import {
  ComponentTemplate,
  DynamicComponentsService,
  LoadedRenderItems,
} from '@app/rvnc-dynamic-renderer/data-access';

@Component({
  selector: 'app-render-template',
  template: `
    <ui-loader *ngIf="!componentRef && component.showLoading"></ui-loader>
    <ng-template #container></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LoaderComponent, NgIf],
  providers: [DynamicComponentsService],
})
export class RenderTemplateComponent<T = unknown>
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) public component: ComponentTemplate;

  @ViewChild('container', { read: ViewContainerRef })
  protected container: ViewContainerRef;

  protected componentRef: ComponentRef<T> | undefined = undefined;

  public constructor(
    private cdr: ChangeDetectorRef,
    private dynamicComponentsService: DynamicComponentsService,
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

    this.cdr.markForCheck();
  }
}
