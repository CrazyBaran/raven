/* eslint-disable @angular-eslint/directive-selector */
import { Directive, HostListener, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RichTextComponent } from '@app/client/shared/dynamic-form-util';
import { log } from '@app/client/shared/util-rxjs';
import { map, merge, switchMap, tap } from 'rxjs';

@Directive({
  selector: '[arrowNavigation]',
  standalone: true,
})
export class CustomKeyboardNavigationDirective {
  public fields = input.required<RichTextComponent[]>({
    alias: 'arrowNavigation',
  });

  public activeField: RichTextComponent | null;

  public constructor() {
    const richEditors$ = toObservable(this.fields);

    richEditors$
      .pipe(
        takeUntilDestroyed(),
        switchMap((editors) => {
          const focusChanges$ = editors.map((editor) =>
            editor.focus$.pipe(
              map(() => ({
                editor,
                index: editors.indexOf(editor),
              })),
            ),
          );

          return merge(...focusChanges$).pipe(
            log({ message: 'active' }),
            tap(({ editor, index }) => {
              this.activeField = editor;
              editors
                .filter((x) => x !== editor)
                .forEach((x) => x.setInactive());
            }),
          );
        }),
      )
      .subscribe();
  }

  @HostListener('keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'ArrowUp') {
      this.setPreviousTabActive();
      event.preventDefault();
    } else if (event.ctrlKey && event.key === 'ArrowDown') {
      this.setNextTabActive();
      event.preventDefault();
    }
  }

  public setNextTabActive(): void {
    if (!this.activeField) {
      this.fields()?.[0]?.setActive();
      return;
    }
    const activeIndex = this.fields().indexOf(this.activeField!);
    const nextIndex = activeIndex + 1;
    if (nextIndex < this.fields().length) {
      this.fields()?.[nextIndex]?.setActive();
    } else {
      this.fields()?.[0]?.setActive();
    }
  }

  public setPreviousTabActive(): void {
    if (!this.activeField) {
      this.fields()?.[0]?.setActive();
      return;
    }
    const activeIndex = this.fields().indexOf(this.activeField!);
    const previousIndex = activeIndex - 1;
    if (previousIndex >= 0) {
      this.fields()?.[previousIndex]?.setActive();
    } else {
      this.fields()?.[this.fields().length - 1]?.setActive();
    }
  }
}
