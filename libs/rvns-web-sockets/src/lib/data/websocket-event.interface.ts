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

export type WebsocketEvent =
  | CreateNoteEvent
  | UpdateNoteEvent
  | DeleteNoteEvent
  | PipelineStageEvent
  | OpportunityFieldChangedEvent;
