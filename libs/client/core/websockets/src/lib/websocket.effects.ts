// TODO: fix boundaries
/* eslint-disable @nx/enforce-module-boundaries */

import { Injectable } from '@angular/core';
import { WebsocketService } from '@app/client/core/websockets';
import { NotesActions } from '@app/client/notes/data-access';
import { OpportunitiesActions } from '@app/client/opportunities/data-access';
import { selectUrl } from '@app/client/shared/util-router';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs';

@Injectable()
export class WebsocketEffects {
  private setResourceEvents$ = createEffect(
    () =>
      this.store.select(selectUrl).pipe(
        filter((url) => !!url),
        tap((url) => {
          if (url.includes('/companies/pipeline')) {
            if (
              this.websocketService.currentResource !== 'resource-pipelines'
            ) {
              this.websocketService.joinResourceEvents('resource-pipelines');
            }
            return;
          }
          if (url.includes('/notes') || url.includes('/companies/')) {
            if (this.websocketService.currentResource !== 'resource-notes') {
              this.websocketService.joinResourceEvents('resource-notes');
            }
            return;
          }

          if (this.websocketService.currentResource) {
            this.websocketService.leaveResourceEvents(
              this.websocketService.currentResource,
            );
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

  private notesUpdateEvent$ = createEffect(
    () =>
      this.websocketService.eventsOfType('note-updated').pipe(
        tap(({ data }) => {
          const { id, rootVersionId } = data;

          console.log('note-updated', data);
        }),
      ),
    { dispatch: false },
  );

  private notesCreateEvent$ = createEffect(() =>
    this.websocketService.eventsOfType('note-created').pipe(
      map(({ data: id }) => {
        return NotesActions.liveCreateNote({ id });
      }),
    ),
  );

  public constructor(
    private store: Store,
    private websocketService: WebsocketService,
  ) {
    this.websocketService.connect();
  }
}
