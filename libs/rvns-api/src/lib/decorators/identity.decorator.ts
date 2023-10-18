import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserData } from '../user/data/user-response-data.interface';

export const Identity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
