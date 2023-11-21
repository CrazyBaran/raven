// TODO: fix boundaries
/* eslint-disable @nx/enforce-module-boundaries */

import { Injectable } from '@angular/core';
import { selectQueryParam } from '@app/client/shared/util-router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  DialogResult,
  DialogService,
  WindowRef,
} from '@progress/kendo-angular-dialog';
import { exhaustMap, filter, map, tap } from 'rxjs';
import { ShelfActions } from './actions/shelf.actions';
import { DynamicDialogService, RavenShelfService } from './raven-shelf.service';

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
                import('@app/client/notes/feaure/notepad').then(
                  (m) => m.NotepadDialogModule,
                ),
              showLoading: true,
            },
            width: 720,
            title: 'Create Note',
            preventClose: (ev: unknown, widowRef): boolean =>
              this._notepadShelfPreventHandler(ev, widowRef),
          }),
        ),
      );
    },
    { dispatch: false },
  );

  private openOpportunityDialogForm = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ShelfActions.openOpportunityForm),
        exhaustMap(
          (action) =>
            this.dynamicDialogService.openDynamicDialog({
              width: 480,
              minHeight: 723,
              cssClass: 'raven-custom-dialog',
              template: {
                name: 'opportunity dialog form',
                componentData: { payload: action.payload },
                load: () =>
                  import(
                    '@app/client/opportunities/feature/create-dialog'
                  ).then((m) => m.CreateOpportunityDialogModule),
                showLoading: true,
              },
            }).result,
        ),
      );
    },
    { dispatch: false },
  );

  private openCreateOpportunityDetails$ = createEffect(() => {
    return this.store.select(selectQueryParam('opportunity-create')).pipe(
      filter((id) => !!id),
      map(() => ShelfActions.openOpportunityForm({})),
    );
  });

  private openEditOpportunityDetails$ = createEffect(
    () => {
      return this.store.select(selectQueryParam('opportunity-edit')).pipe(
        filter((id) => !!id),
        exhaustMap(
          () =>
            this.dynamicDialogService.openDynamicDialog({
              width: 480,
              minHeight: 723,
              cssClass: 'raven-custom-dialog',
              template: {
                name: 'opportunity dialog edit form',
                load: () =>
                  import(
                    '@app/client/opportunities/feature/update-dialog'
                  ).then((m) => m.CreateOpportunityDialogModule),
                showLoading: true,
              },
            }).result,
        ),
      );
    },
    { dispatch: false },
  );

  private openNoteDetails$ = createEffect(
    () => {
      return this.store.select(selectQueryParam('note-details')).pipe(
        filter((id) => !!id),
        tap(async (id) =>
          this.shelfService.openLazyWindow({
            template: {
              name: 'note-details',
              load: () =>
                import('@app/client/notes/feature/note-details-dialog').then(
                  (m) => m.NotepadDialogModule,
                ),
              showLoading: true,
            },
            width: 860,
            height: 800,
            cssClass: 'max-h-full',
            hostCssClass: 'global-window-container',
          }),
        ),
      );
    },
    { dispatch: false },
  );

  public constructor(
    private actions$: Actions,
    private store: Store,
    private shelfService: RavenShelfService,
    private dialogService: DialogService,
    private dynamicDialogService: DynamicDialogService,
  ) {}

  private _notepadShelfPreventHandler(
    _: unknown,
    widowRef: WindowRef | undefined,
  ): boolean {
    if (!widowRef?.content.instance.properties.hasChanges) {
      return false;
    }

    this.dialogService
      .open({
        appendTo: widowRef?.content.instance.properties.containerRef,
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
