import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { BehaviorSubject, Observable } from 'rxjs';

type Options = {
  element: unknown;
  description: string | undefined;
  keys: string;
};

@Injectable({
  providedIn: 'root',
})
export class HotKeysService {
  public hotkeys = new Map<string, string | unknown>();
  public hotkeys$ = new BehaviorSubject<{ key: string; description: string }[]>(
    [],
  );

  public defaults: Partial<Options> = {
    element: this.document,
  };

  public constructor(
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  public addHotkey(options: Partial<Options>): Observable<unknown> {
    const merged = { ...this.defaults, ...options };
    const event = `keydown.${merged.keys}`;

    if (merged.description) {
      this.hotkeys.set(merged.keys as string, merged.description);
      this.updateHotkeys();
    }

    return new Observable((observer) => {
      const handler = (e: Event): void => {
        e.preventDefault();
        observer.next(e);
      };

      const dispose = this.eventManager.addEventListener(
        merged.element as HTMLElement,
        event,
        handler,
      );

      return () => {
        dispose();
        this.hotkeys.delete(merged.keys as string);
        this.updateHotkeys();
      };
    });
  }

  private updateHotkeys(): void {
    const hotkeysArr = Array.from(this.hotkeys.entries()).map(
      ([key, description]) => ({
        key: key,
        description: description as string,
      }),
    );

    this.hotkeys$.next(hotkeysArr);
  }
}
