// TODO: fix boundaries
/* eslint-disable @nx/enforce-module-boundaries */
import {
  ApplicationRef,
  ComponentRef,
  effect,
  inject,
  Injectable,
  NgModuleRef,
  signal,
} from '@angular/core';
import { ComponentTemplate } from '@app/client/shared/dynamic-renderer/data-access';
import {
  RenderShelfTemplateComponent,
  RenderTemplateComponent,
} from '@app/client/shared/dynamic-renderer/feature';
import { KendoWindowContainerComponent } from '@app/client/shared/ui';
import {
  DialogRef,
  DialogService,
  DialogSettings,
  WindowRef,
  WindowService,
  WindowSettings,
  WindowState,
} from '@progress/kendo-angular-dialog';

const DYNAMIC_SHELF_VARIABLES = {
  width: '--shelf-window-width',
  height: '--shelf-window-height',
  transform: '--shelf-window-transform',
};

@Injectable({
  providedIn: 'root',
})
export class DynamicDialogService {
  protected dialogService = inject(DialogService);

  public openDynamicDialog(
    settings: Omit<DialogSettings, 'content'> & { template: ComponentTemplate },
  ): DialogRef {
    const dialogRef = this.dialogService.open({
      content: RenderTemplateComponent,
      ...settings,
    });

    dialogRef.content.instance.component = settings.template;
    dialogRef.dialog.instance.themeColor = 'primary';

    return dialogRef;
  }
}

@Injectable()
export class RavenShelfService {
  protected config = {
    headerHeight: 80,
    tabsGap: 16,
    defaultWidth: 700,
    defaultMinimizedWidth: 300,
    defaultMinimizedHeight: 44,
  };

  protected windowsRefsSignal = signal([] as WindowRef[]);
  protected windowWidths = signal([] as number[]);

  public constructor(
    private windowService: WindowService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private moduleRef: NgModuleRef<any>,
    private appRef: ApplicationRef,
  ) {
    effect((): void => {
      this.windowsRefsSignal().forEach((windowRef, index) => {
        const sumPreviousWidths = this.windowWidths().reduce(
          (acc, width, i) => (i < index ? acc + (width + 16) : acc),
          0,
        );
        this._updateShelfOffset(windowRef, sumPreviousWidths);
      });
    });
  }

  public openLazyWindow(
    settings: Omit<WindowSettings, 'content'> & {
      template: ComponentTemplate;
      hostCssClass?: string;
    },
  ): WindowRef {
    const ref = this._createContainer({ class: settings.hostCssClass });

    const windowRef = this.windowService.open({
      content: RenderShelfTemplateComponent,
      ...settings,
      appendTo: ref.instance.container,
    });

    windowRef.content.instance.component = settings.template;
    windowRef.window.instance.themeColor = 'primary';

    windowRef.window.onDestroy(() => {
      ref.destroy();
    });

    return windowRef;
  }

  public openLazyShelf(
    settings: Omit<WindowSettings, 'content'> & { template: ComponentTemplate },
  ): WindowRef {
    const ref = this._createContainer({ class: 'kendo-window' });

    const windowRef = this.openShelf({
      content: RenderTemplateComponent,
      ...settings,
      cssClass: settings.cssClass ?? '' + ' rotate-180',
      appendTo: ref.instance.container,
    });

    windowRef.content.instance.component = settings.template;

    windowRef.window.onDestroy(() => {
      ref.destroy();
    });

    return windowRef;
  }

  public openShelf(settings: WindowSettings): WindowRef {
    const index = this.windowsRefsSignal().length;
    const defaultShelfDimensions = {
      width: settings.width || this.config.defaultWidth,
      height:
        settings.height ||
        (`calc(100% - ${this.config.headerHeight}px)` as unknown as number),
    };

    const windowRef = this.windowService.open({
      title: 'Shell',
      keepContent: true,
      ...settings,
      ...defaultShelfDimensions,
      left: 0,
      top: 0,
      draggable: false,
      resizable: false,
      cssClass: `shelf-window rotate-180`,
    });
    windowRef.window.instance.themeColor = 'primary';

    this.windowsRefsSignal.update((windows) => [...windows, windowRef]);

    this._updateShelf(windowRef, defaultShelfDimensions);

    windowRef.window.instance.stateChange.subscribe((state) =>
      this._onShelfStateChange(windowRef, state, defaultShelfDimensions),
    );

    windowRef.result.subscribe(() => this._removeShelf(windowRef));

    return windowRef;
  }

  private _createContainer(params?: {
    class?: string;
  }): ComponentRef<KendoWindowContainerComponent> {
    const factory =
      this.moduleRef.componentFactoryResolver.resolveComponentFactory(
        KendoWindowContainerComponent,
      );

    const newNode = document.createElement('div');
    newNode.className = params?.class ?? '';
    document.body.prepend(newNode);

    const ref = factory.create(this.moduleRef.injector, [], newNode);
    this.appRef.attachView(ref.hostView);

    return ref;
  }

  private _onShelfStateChange(
    windowRef: WindowRef,
    state: WindowState,
    defaultDimensions: {
      width: number;
      height: string | number;
    },
  ): void {
    const dymensions =
      state === 'minimized'
        ? {
            width: this.config.defaultMinimizedWidth,
            height: this.config.defaultMinimizedHeight,
          }
        : defaultDimensions;

    this._updateShelf(windowRef, dymensions);
  }

  private _removeShelf(windowRef: WindowRef): void {
    const windowIndex = this.windowsRefsSignal().indexOf(windowRef);
    this.windowsRefsSignal.update((windows) =>
      windows.filter((ref) => ref !== windowRef),
    );
    this.windowWidths.update((widths) =>
      widths.filter((width, index) => index !== windowIndex),
    );
  }

  private _updateShelf(
    windowRef: WindowRef,
    settings: {
      width?: number;
      height?: number | string;
      offset?: number;
    },
  ): void {
    const { width, height, offset } = settings;
    width && this._updateShelfWidth(windowRef, width);
    height && this._updateShelfHeight(windowRef, height);
    offset && this._updateShelfOffset(windowRef, offset);
  }

  private _updateShelfWidth(windowRef: WindowRef, width: number): void {
    const windowIndex = this.windowsRefsSignal().indexOf(windowRef);

    this.windowWidths.update((widths) => {
      widths[windowIndex] = width;
      return [...widths];
    });

    this._setProperty(windowRef, DYNAMIC_SHELF_VARIABLES.width, `${width}px`);
  }

  private _updateShelfHeight(
    windowRef: WindowRef,
    height: string | number,
  ): void {
    this._setProperty(
      windowRef,
      DYNAMIC_SHELF_VARIABLES.height,
      typeof height === 'number' ? `${height}px` : height,
    );
  }

  private _updateShelfOffset(windowRef: WindowRef, offset: number): void {
    this._setProperty(
      windowRef,
      DYNAMIC_SHELF_VARIABLES.transform,
      `translateX(-${offset}px)`,
    );
  }

  private _setProperty(
    windowRef: WindowRef,
    property: string,
    value: string,
  ): void {
    const nativeElement = windowRef?.window?.location?.nativeElement;

    //check if property changed
    if (
      nativeElement &&
      nativeElement.style.getPropertyValue(property) !== value
    ) {
      nativeElement.style.setProperty(property, value);
    }

    windowRef.window.location.nativeElement.style.setProperty(property, value);
  }
}
