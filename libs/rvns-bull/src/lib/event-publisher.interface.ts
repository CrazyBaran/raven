import { Socket } from 'socket.io';

import { JobPro } from '@taskforcesh/bullmq-pro';
import { EventState } from './event-state.type';

export interface EmitOptions {
  readonly client?: Socket;
  readonly progress?: number;
}

export interface EventPublisher {
  emit(job: JobPro, state: EventState, options?: EmitOptions): void;
}
