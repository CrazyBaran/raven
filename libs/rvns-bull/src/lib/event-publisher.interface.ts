import { Job } from 'bullmq';
import { Socket } from 'socket.io';

import { EventState } from './event-state.type';

export interface EmitOptions {
  readonly client?: Socket;
  readonly progress?: number;
}

export interface EventPublisher {
  emit(job: Job, state: EventState, options?: EmitOptions): void;
}
