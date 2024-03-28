export interface BaseWebsocketEvent<T = unknown> {
  eventType: string;
  data: T;
}

export interface CreateNoteEvent extends BaseWebsocketEvent<string> {
  eventType: 'note-created';
}
export interface UpdateNoteEvent
  extends BaseWebsocketEvent<{ id: string; rootVersionId: string }> {
  eventType: 'note-updated';
}

export interface DeleteNoteEvent extends BaseWebsocketEvent<string> {
  eventType: 'note-deleted';
}

export interface PipelineStageEvent
  extends BaseWebsocketEvent<{ opportunityId: string; stageId: string }> {
  eventType: 'pipeline-stage-changed';
}

export interface OpportunityFieldChangedEvent
  extends BaseWebsocketEvent<{
    opportunityId: string;
    fields: { displayName: string; value: unknown }[];
  }> {
  eventType: 'opportunity-field-changed';
}

export interface AddedToShortlistEvent
  extends BaseWebsocketEvent<{
    organisationId: string;
    shortlistId: string;
    shortlistName: string;
  }> {
  eventType: 'added-to-shortlist';
}

export interface RemovedFromShortlistEvent
  extends BaseWebsocketEvent<{
    organisationIds: string[];
    shortlistId: string;
  }> {
  eventType: 'removed-from-shortlist';
}

export type WebsocketEvent =
  | CreateNoteEvent
  | UpdateNoteEvent
  | DeleteNoteEvent
  | PipelineStageEvent
  | OpportunityFieldChangedEvent
  | AddedToShortlistEvent
  | RemovedFromShortlistEvent;
