import { UserData } from '@app/rvns-api';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Identity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
