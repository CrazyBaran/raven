import { Injectable, Type } from '@angular/core';
import { DynamicControl } from '@app/rvnc-notes/util';
import { from, of, tap } from 'rxjs';

type DynamicControlsMap = {
  [T in DynamicControl['controlType']]: () => Promise<Type<any>>;
};

@Injectable({
  providedIn: 'root',
})
export class DynamicControlResolver {
  private lazyControlComponents: DynamicControlsMap = {
    input: () =>
      import('./dynamic-input/dynamic-input.component').then(
        (c) => c.DynamicInputComponent,
      ),
    richText: () =>
      import('./dynamic-rich-text/dynamic-rich-text.component').then(
        (c) => c.DynamicRichTextComponent,
      ),
  };
  private loadedControlComponents = new Map<string, Type<any>>();

  resolve(controlType: keyof DynamicControlsMap) {
    const loadedComponent = this.loadedControlComponents.get(controlType);
    if (loadedComponent) {
      return of(loadedComponent);
    }
    return from(this.lazyControlComponents[controlType]()).pipe(
      tap((comp) => this.loadedControlComponents.set(controlType, comp)),
    );
  }
}
