import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

@Injectable()
export class DynamicControlFocusHandler {
  private _focus$ = new BehaviorSubject<string>('');

  focusTo(controlKey: string) {
    this._focus$.next(controlKey);
  }

  focus$() {
    return this._focus$.pipe(distinctUntilChanged());
  }

  focusChanged$(controlKey?: string) {
    return this._focus$.pipe(
      map((key) => !controlKey || key === controlKey),
      distinctUntilChanged(),
    );
  }
}
