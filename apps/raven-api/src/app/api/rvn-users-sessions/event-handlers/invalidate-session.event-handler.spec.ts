import { UsersSessionsService } from '../users-sessions.service';
import { InvalidateSessionEventHandlerLogger } from './invalidate-session-event-handler.logger';
import { InvalidateSessionEventHandler } from './invalidate-session.event-handler';
import { Test } from '@nestjs/testing';

describe('InvalidateSessionEventHandler', () => {
  let handler: InvalidateSessionEventHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InvalidateSessionEventHandler,
        {
          provide: UsersSessionsService,
          useValue: {},
        },
        {
          provide: InvalidateSessionEventHandlerLogger,
          useValue: {},
        },
      ],
    }).compile();

    handler = module.get<InvalidateSessionEventHandler>(
      InvalidateSessionEventHandler,
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });
});
