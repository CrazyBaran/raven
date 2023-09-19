import * as expressBasicAuth from 'express-basic-auth';
import * as _ from 'lodash';

import { environment } from '../../environments/environment';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/dist/src/queueAdapters/bullMQ';
import { ExpressAdapter } from '@bull-board/express';
import { DynamicModule, INestApplication, Injectable } from '@nestjs/common';
import { Queue } from '@taskforcesh/bullmq-pro';
import { BullModule } from '@taskforcesh/nestjs-bullmq-pro';
import { RegisterFlowProducerOptions } from '@taskforcesh/nestjs-bullmq-pro/dist/interfaces/register-flow-producer-options.interface';
import { RegisterQueueOptions } from '@taskforcesh/nestjs-bullmq-pro/dist/interfaces/register-queue-options.interface';

interface EnhancedBullModuleOptions extends RegisterQueueOptions {
  order?: number;
  description?: string;
}

@Injectable()
export class BullService {
  // looks like there is no way to extract registered queues from BullModule
  protected static queues: EnhancedBullModuleOptions[] = [];

  public static registerQueue(
    options: EnhancedBullModuleOptions[],
  ): DynamicModule {
    options.forEach((option) => this.queues.push(option));
    return BullModule.registerQueue(
      ...options.map((q) => ({
        ...q,
        connection: environment.bull.config.connection,
      })),
    );
  }

  public static registerFlowProducer(
    options: RegisterFlowProducerOptions[],
  ): DynamicModule {
    return BullModule.registerFlowProducer(
      ...options.map((fp) => ({
        ...fp,
        connection: environment.bull.config.connection,
      })),
    );
  }

  public enableBullBoard(app: INestApplication, path: string): void {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(`/${path}`);
    createBullBoard({
      queues: _.sortBy(BullService.queues, 'order').map(
        (queue) =>
          new BullMQAdapter(app.get<Queue>(`BullQueue_${queue.name}`), {
            description: queue.description,
            readOnlyMode: environment.bull.board.readOnly,
          }),
      ),
      serverAdapter,
    });
    const middlewares = [serverAdapter.getRouter()];
    if (environment.bull.board.basicAuth) {
      middlewares.unshift(
        expressBasicAuth({
          users: {
            [environment.bull.board.basicAuthUser]:
              environment.bull.board.basicAuthPassword,
          },
          challenge: true,
        }),
      );
    }
    app.use(`/${path}`, ...middlewares);
  }
}
