/* eslint-disable @typescript-eslint/explicit-member-accessibility,@typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any */
import {
  ComponentRef,
  Injectable,
  Injector,
  NgModuleRef,
  ViewContainerRef,
  createNgModule,
} from '@angular/core';

import {
  ComponentTemplate,
  DynamicComponentConstructor,
  DynamicModule,
  LoadedRenderItem,
  isComponentConstructor,
  isModuleConstructor,
} from './render-template.types';

@Injectable({ providedIn: 'root' })
export class DynamicComponentsService {
  cachedTemplates = new Map<
    string,
    NgModuleRef<DynamicModule> | DynamicComponentConstructor
  >();

  constructor(public injector: Injector) {}

  async loadComponentConstructor(template: ComponentTemplate) {
    if (this.cachedTemplates.has(template.name)) {
      return this.cachedTemplates.get(template.name)!;
    }

    const loadedComponentConstructor = await template.load();

    if (isModuleConstructor(loadedComponentConstructor)) {
      const module = createNgModule<DynamicModule>(
        loadedComponentConstructor,
        this.injector,
      );
      this.cachedTemplates.set(template.name, module);
      return module;
    } else {
      // standalone component
      this.cachedTemplates.set(template.name, loadedComponentConstructor);
      return loadedComponentConstructor;
    }
  }

  createComponent(
    container: ViewContainerRef,
    componentTemplate: ComponentTemplate,
    renderItem: LoadedRenderItem,
  ) {
    let componentRef: ComponentRef<any>;
    let resolverData: any;

    if (!isComponentConstructor(renderItem)) {
      resolverData =
        renderItem.instance.componentDataResolver &&
        renderItem.instance.componentDataResolver(
          componentTemplate.componentData || {},
        );
      componentRef = container.createComponent(renderItem.instance.entry, {
        ngModuleRef: renderItem,
      });
      // if resolver data found apply to the component
    } else {
      componentRef = container.createComponent(renderItem);
      resolverData =
        componentRef.instance.componentDataResolver &&
        componentRef.instance.componentDataResolver(
          componentTemplate.componentData || {},
        );
    }

    if (resolverData) {
      Object.keys(resolverData).forEach(
        (key) => (componentRef.instance[key] = resolverData[key]),
      );
    }

    container.insert(componentRef.hostView);
    return componentRef;
  }
}
