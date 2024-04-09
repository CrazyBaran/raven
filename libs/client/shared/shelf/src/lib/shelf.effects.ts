// TODO: fix boundaries
/* eslint-disable @nx/enforce-module-boundaries */

import { Injectable } from '@angular/core';
import { OPPORTUNITY_DYNAMIC_DIALOGS } from '@app/client/opportunities/feature/dialogs';
import { ComponentTemplate } from '@app/client/shared/dynamic-renderer/data-access';
import { DialogUtil } from '@app/client/shared/util';
import {
  selectQueryParam,
  selectQueryParams,
  selectUrl,
} from '@app/client/shared/util-router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  DialogResult,
  DialogService,
  DialogSettings,
  WindowRef,
} from '@progress/kendo-angular-dialog';
import { exhaustMap, filter, map, of, tap } from 'rxjs';
import { ShelfActions } from './actions/shelf.actions';
import { DynamicDialogService, RavenShelfService } from './raven-shelf.service';

export const dynamicDialogsConfig: Record<
  string,
  | {
      settings?: Omit<DialogSettings, 'content'>;
      template: Omit<ComponentTemplate, 'name'>;
    }
  | ComponentTemplate['load']
> = {
  ...OPPORTUNITY_DYNAMIC_DIALOGS,
  [DialogUtil.queryParams.passCompany]: {
    template: {
      load: () =>
        import('@app/client/organisations/feature/dialogs').then(
          (m) => m.PassCompanyDialogModule,
        ),
    },
    settings: {
      cssClass: 'raven-custom-dialog k-dialog-secondary',
    },
  },
  [DialogUtil.queryParams.moveToOutreachCompany]: () =>
    import('@app/client/organisations/feature/dialogs').then(
      (m) => m.MoveToOutreachCompanyDialogModule,
    ),

  [DialogUtil.queryParams.updateShortlist]: () =>
    import('@app/client/shortlists/feature/dialogs').then(
      (m) => m.UpdateShortlistDialogModule,
    ),
  [DialogUtil.queryParams.createShortlist]: () =>
    import('@app/client/shortlists/feature/dialogs').then(
      (m) => m.CreateShortlistDialogModule,
    ),
  [DialogUtil.queryParams.deleteShortlist]: () =>
    import('@app/client/shortlists/feature/dialogs').then(
      (m) => m.DeleteShortlistDialogModule,
    ),
  [DialogUtil.queryParams.addToShortlist]: () =>
    import('@app/client/shortlists/feature/dialogs').then(
      (m) => m.AddToShortlistDialogModule,
    ),
  [DialogUtil.queryParams.removeFromShortlist]: () =>
    import('@app/client/shortlists/feature/dialogs').then(
      (m) => m.RemoveFromShortlistDialogModule,
    ),
  [DialogUtil.queryParams.updateReminder]: () =>
    import('@app/client/reminders/feature/dialogs').then(
      (m) => m.UpdateReminderDialogModule,
    ),
  [DialogUtil.queryParams.createReminder]: () =>
    import('@app/client/reminders/feature/dialogs').then(
      (m) => m.CreateReminderDialogModule,
    ),
  [DialogUtil.queryParams.deleteReminder]: () =>
    import('@app/client/reminders/feature/dialogs').then(
      (m) => m.DeleteReminderDialogModule,
    ),
  [DialogUtil.queryParams.reminderDetails]: () =>
    import('@app/client/reminders/feature/dialogs').then(
      (m) => m.ReminderDetailsDialogModule,
    ),
  [DialogUtil.queryParams.completeReminder]: () =>
    import('@app/client/reminders/feature/dialogs').then(
      (m) => m.CompleteReminderDialogModule,
    ),
  [DialogUtil.queryParams.updateOrganisationDescription]: () =>
    import('@app/client/organisations/feature/dialogs').then(
      (m) => m.UpdateOrganisationDescriptionModule,
    ),
};

@Injectable()
export class ShelfEffects {
  private openNotepadShelf$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ShelfActions.openNotepad),
        tap(async (action) =>
          this.shelfService.openLazyShelf({
            template: {
              name: 'notepad',
              load: () =>
                import('@app/client/notes/feature/notepad').then(
                  (m) => m.NotepadDialogModule,
                ),
              showLoading: true,
              componentData: {
                organisationId: action.organisationId,
                opportunityId: action.opportunityId,
              },
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

  private showRouteDialog = createEffect(
    () => {
      return this.store.select(selectQueryParams).pipe(
        map((params) => {
          const dialog = Object.keys(params).find((key) =>
            Object.keys(dynamicDialogsConfig).includes(key),
          );
          const settings = dialog ? dynamicDialogsConfig[dialog] : null;

          if (typeof settings === 'function') {
            return { dialog, template: { load: settings } };
          }

          return dialog ? { dialog, ...dynamicDialogsConfig[dialog] } : null;
        }),
        filter((settings) => !!settings),
        exhaustMap((config) =>
          !config
            ? of([])
            : 'settings' in config
              ? this.dynamicDialogService.openDynamicDialog({
                  width: 480,
                  maxHeight: '95vh',
                  cssClass: 'raven-custom-dialog',
                  ...config!.settings,
                  template: {
                    name: config!.dialog,
                    ...config!.template,
                  },
                }).result
              : this.dynamicDialogService.openDynamicDialog({
                  width: 480,
                  maxHeight: '95vh',
                  cssClass: 'raven-custom-dialog',
                  template: {
                    name: config!.dialog!,
                    load: config.template!.load,
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
        concatLatestFrom(() => this.store.select(selectUrl)),
        tap(async ([id, url]) =>
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
            hostCssClass: url.includes('opportunities')
              ? undefined
              : 'global-window-container',
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
