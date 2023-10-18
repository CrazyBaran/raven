import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable()
export class DynamicControlFocusHandler {
  private _focus$ = new BehaviorSubject<string>('');

  public focusTo(controlKey: string): void {
    this._focus$.next(controlKey);
  }

  public focus$(): Observable<string> {
    return this._focus$.pipe(distinctUntilChanged());
  }

  public focusChanged$(controlKey?: string): Observable<boolean> {
    return this._focus$.pipe(
      map((key) => !controlKey || key === controlKey),
      distinctUntilChanged(),
    );
  }
}
