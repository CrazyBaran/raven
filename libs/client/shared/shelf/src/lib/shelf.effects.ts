// TODO: fix boundaries
/* eslint-disable @nx/enforce-module-boundaries */

import { Injectable } from '@angular/core';
import { ComponentTemplate } from '@app/client/shared/dynamic-renderer/data-access';
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
import { exhaustMap, filter, map, tap } from 'rxjs';
import { ShelfActions } from './actions/shelf.actions';
import { DynamicDialogService, RavenShelfService } from './raven-shelf.service';

export class DialogQueryParams {
  public static readonly reopenOpportunity = 'reopen-opportunity';
  public static readonly updateOpportunityStage = 'update-opportunity-stage';
  public static readonly passCompany = 'pass-company';
  public static readonly moveToOutreachCompany = 'move-to-outreach-company';
}

export const dynamicDialogsConfig: Record<
  string,
  {
    settings?: Omit<DialogSettings, 'content'>;
    template: Omit<ComponentTemplate, 'name'>;
  }
> = {
  [DialogQueryParams.reopenOpportunity]: {
    template: {
      load: () =>
        import('@app/client/opportunities/feature/update-dialog').then(
          (m) => m.ReopenOpportunityDialogModule,
        ),
    },
  },
  [DialogQueryParams.updateOpportunityStage]: {
    template: {
      load: () =>
        import('@app/client/opportunities/feature/update-dialog').then(
          (m) => m.UpdateOpportunityStageModule,
        ),
    },
  },
  [DialogQueryParams.passCompany]: {
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
  [DialogQueryParams.moveToOutreachCompany]: {
    template: {
      load: () =>
        import('@app/client/organisations/feature/dialogs').then(
          (m) => m.MoveToOutreachCompanyDialogModule,
        ),
    },
  },
};

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
                import('@app/client/notes/feature/notepad').then(
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
              minHeight: 'min(723px,95vh)',
              maxHeight: '95vh',
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
              minHeight: 'min(723px,95vh)',
              maxHeight: '95vh',
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

  private showRouteDialog = createEffect(
    () => {
      return this.store.select(selectQueryParams).pipe(
        map((params) => {
          const dialog = Object.keys(params).find((key) =>
            Object.keys(dynamicDialogsConfig).includes(key),
          );
          return dialog ? { dialog, ...dynamicDialogsConfig[dialog] } : null;
        }),
        filter((settings) => !!settings),
        exhaustMap(
          (config) =>
            this.dynamicDialogService.openDynamicDialog({
              width: 480,
              maxHeight: '95vh',
              cssClass: 'raven-custom-dialog',
              ...config!.settings,
              template: {
                name: config!.dialog,
                ...config!.template,
              },
            }).result,
        ),
      );
    },
    { dispatch: false },
  );

  private openEditFinancialKpi$ = createEffect(
    () => {
      return this.store.select(selectQueryParam('edit-financial-kpi')).pipe(
        filter((id) => !!id),
        exhaustMap(
          () =>
            this.dynamicDialogService.openDynamicDialog({
              width: 508,
              height: 716,
              maxHeight: '90vh',
              cssClass: 'raven-custom-dialog',
              template: {
                name: 'edit financial kpi form',
                load: () =>
                  import(
                    '@app/client/opportunities/feature/edit-financial-kpi'
                  ).then((m) => m.EditFinancialKpiDialogModule),
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
