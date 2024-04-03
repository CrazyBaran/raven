// TODO: fix boundaries
/* eslint-disable @nx/enforce-module-boundaries */

import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '@app/client/core/environment';
import { WebsocketService } from '@app/client/core/websockets';
import { NotesActions, notesQuery } from '@app/client/notes/state';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { RemindersActions } from '@app/client/reminders/state';
import { selectUrl } from '@app/client/shared/util-router';
import { WebsocketResourceType } from '@app/rvns-web-sockets';
import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, merge, tap } from 'rxjs';
import { OrganisationsActions } from '../../../../organisations/state/src';

const URL_RESOURCE_CONFIG: Record<
  WebsocketResourceType,
  (url: string) => boolean
> = {
  pipelines: (url) => url.includes('/companies/pipeline'),
  notes: (url) => url.includes('/notes') || url.includes('/companies/'),
  shortlists: (url) => url.includes('/companies'),
  reminders: (_url) => true,
};

@Injectable()
export class WebsocketEffects {
  private setResourceEvents$ = createEffect(
    () =>
      this.store.select(selectUrl).pipe(
        filter((url) => !!url),
        tap((url) => {
          const resources = Object.entries(URL_RESOURCE_CONFIG)
            .filter(([_, isMatch]) => isMatch(url))
            .map(([resource]) => resource) as WebsocketResourceType[];

          if (resources.length) {
            if (!this.websocketService.connected()) {
              this.websocketService.connect(this.environment.websocketUrl);
            }
            this.websocketService.joinResourcesEvents(resources);
          } else if (this.websocketService.connected()) {
            this.websocketService.disconnect();
          }
        }),
      ),
    { dispatch: false },
  );

  private pipelineUpdateEvent$ = createEffect(() =>
    this.websocketService.eventsOfType('pipeline-stage-changed').pipe(
      map(({ data }) => {
        const { opportunityId, stageId } = data;

        return OpportunitiesActions.liveChangeOpportunityPipelineStage({
          id: opportunityId,
          pipelineStageId: stageId,
        });
      }),
    ),
  );

  private notesUpdateEvent$ = createEffect(() =>
    this.websocketService.eventsOfType('note-updated').pipe(
      concatLatestFrom(() =>
        this.store.select(notesQuery.selectNotesDictionaryByRootId),
      ),
      map(([{ data }, dictionary]) => {
        const { id, rootVersionId } = data;
        const note = dictionary[rootVersionId];

        return { id: note?.id, newSyncId: id };
      }),
      filter((note) => !!note.id),
      map((data) => NotesActions.liveChangeNote({ ...data })),
    ),
  );

  private notesCreateEvent$ = createEffect(() =>
    this.websocketService.eventsOfType('note-created').pipe(
      map(({ data: id }) => {
        return NotesActions.liveCreateNote({ id });
      }),
    ),
  );

  private notesDeleteEvent$ = createEffect(() =>
    this.websocketService.eventsOfType('note-deleted').pipe(
      map(({ data: id }) => {
        return NotesActions.liveDeleteNote({ id });
      }),
    ),
  );

  private liveAddedToShortlistEvent$ = createEffect(() =>
    this.websocketService.eventsOfType('added-to-shortlist').pipe(
      map(({ data: { organisationId, shortlistId, shortlistName } }) => {
        return OrganisationsActions.liveAddToShortlist({
          organisationId,
          shortlistId,
          shortlistName,
        });
      }),
    ),
  );

  private liveRemovedFromShortlistEvent$ = createEffect(() =>
    this.websocketService.eventsOfType('removed-from-shortlist').pipe(
      map(({ data: { organisationIds, shortlistId } }) => {
        return OrganisationsActions.liveRemoveFromShortlist({
          organisationIds,
          shortlistId,
        });
      }),
    ),
  );

  private reminderStatsRefresh = createEffect(() =>
    merge(
      this.websocketService.eventsOfType('reminder-created'),
      this.websocketService.eventsOfType('reminder-updated'),
      this.websocketService.eventsOfType('reminder-deleted'),
    ).pipe(
      map(() => {
        return RemindersActions.anyReminderWebsocketEvent();
      }),
    ),
  );

  public constructor(
    private store: Store,
    private websocketService: WebsocketService,
    @Inject(ENVIRONMENT)
    private environment: Environment,
  ) {}
}
