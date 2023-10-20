import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  DialogResult,
  DialogService,
  WindowRef,
} from '@progress/kendo-angular-dialog';
import { tap } from 'rxjs';
import { ShelfActions } from './actions/shelf.actions';
import { RavenShelfService } from './raven-shelf.service';

@Injectable()
export class ShelfEffects {
  private openNotepadShelf$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ShelfActions.openNotepad),
        tap(async () =>
          this.shelfService.openLazyShelf({
            template: {
              name: 'notepad',
              load: () =>
                import('@app/rvnc-notes/feature/notepad').then(
                  (m) => m.NotepadDialogModule,
                ),
              showLoading: true,
            },
            width: 700,
            title: 'Create Note',
            preventClose: (ev: unknown, widowRef): boolean =>
              this._notepadShelfPreventHandler(ev, widowRef),
          }),
        ),
      );
    },
    { dispatch: false },
  );

  public constructor(
    private actions$: Actions,
    private shelfService: RavenShelfService,
    private dialogService: DialogService,
  ) {}

  private _notepadShelfPreventHandler(
    _: unknown,
    widowRef: WindowRef | undefined,
  ): boolean {
    {
      if (!widowRef?.content.instance.properties.notepadForm.dirty) {
        return false;
      }

      this.dialogService
        .open({
          title: 'Leave without publishing?',
          width: 350,
          content:
            'Any progress will be lost without publishing first. Are you sure you want to continue?',
          actions: [
            { text: 'No' },
            {
              text: 'Yes, leave without publishing',
              primary: true,
              themeColor: 'primary',
            },
          ],
        })
        .result.subscribe((res: DialogResult) => {
          if ('text' in res && res.text === 'Yes, leave without publishing') {
            widowRef.close();
          }
        });

      return true;
    }
  }
}
