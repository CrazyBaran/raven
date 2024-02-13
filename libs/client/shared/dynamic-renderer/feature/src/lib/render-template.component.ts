/* eslint-disable @typescript-eslint/member-ordering */
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
import {
  ComponentTemplate,
  DynamicComponentsService,
  LoadedRenderItems,
} from '@app/client/shared/dynamic-renderer/data-access';
import { LoaderComponent } from '@app/client/shared/ui';
import * as _ from 'lodash';

@Component({
  selector: 'app-render-template',
  template: `
    <ui-loader *ngIf="!componentRef && component?.showLoading"></ui-loader>
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
  @ViewChild('container', { read: ViewContainerRef })
  protected container: ViewContainerRef;

  protected componentRef: ComponentRef<T> | undefined = undefined;

  public constructor(
    private cdr: ChangeDetectorRef,
    private dynamicComponentsService: DynamicComponentsService,
  ) {}

  private _component: ComponentTemplate | undefined;

  public get component(): ComponentTemplate | undefined {
    return this._component;
  }

  @Input({ required: true }) public set component(value: ComponentTemplate) {
    const previousComponent = this._component;
    this._component = value;

    if (
      previousComponent &&
      value &&
      !_.isEqual(previousComponent.componentData, value.componentData)
    ) {
      this.createComponent();
    }
  }

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
    this.createComponent();
  }

  private createComponent(): void {
    if (!this.container || !this.component) {
      return;
    }

    this.componentRef?.destroy();

    this.dynamicComponentsService
      .loadComponentConstructor(this.component)
      .then((item) => {
        this.container?.clear();

        this.renderComponent({
          renderItemRef: item,
          componentTemplate: this.component!,
        });
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
