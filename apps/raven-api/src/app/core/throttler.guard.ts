import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';

export class ThrottlerGuard extends NestThrottlerGuard {
  protected errorMessage =
    'You are sending requests too fast. Please slow down and try again later.';
}
