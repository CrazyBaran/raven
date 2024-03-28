// TODO: fix boundaries
/* eslint-disable @nx/enforce-module-boundaries */

import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '@app/client/core/environment';
import { WebsocketService } from '@app/client/core/websockets';
import { NotesActions, notesQuery } from '@app/client/notes/state';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { selectUrl } from '@app/client/shared/util-router';
import { WebsocketResourceType } from '@app/rvns-web-sockets';
import { concatLatestFrom, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs';
import { OrganisationsActions } from '../../../../organisations/state/src';

const URL_RESOURCE_CONFIG: Record<
  WebsocketResourceType,
  (url: string) => boolean
> = {
  pipelines: (url) => url.includes('/companies/pipeline'),
  notes: (url) => url.includes('/notes') || url.includes('/companies/'),
  shortlists: (url) => url.includes('/companies'),
  reminders: (_url) => false, // TODO: Frontend implementation
};

@Injectable()
export class WebsocketEffects {
  private setResourceEvents$ = createEffect(
    () =>
      this.store.select(selectUrl).pipe(
        filter((url) => !!url),
        tap((url) => {
          const resource = Object.entries(URL_RESOURCE_CONFIG).find(
            ([_, isMatch]) => isMatch(url),
          )?.[0] as WebsocketResourceType;

          if (resource) {
            if (!this.websocketService.connected()) {
              this.websocketService.connect(this.environment.websocketUrl);
            }
            this.websocketService.joinResourceEvents(resource);
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

  public constructor(
    private store: Store,
    private websocketService: WebsocketService,
    @Inject(ENVIRONMENT)
    private environment: Environment,
  ) {}
}
