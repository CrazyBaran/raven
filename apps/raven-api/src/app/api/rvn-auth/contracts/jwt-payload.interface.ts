import { AuthModeEnum } from '@app/rvns-api';

export interface JwtPayload {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly teamId: string;
  readonly authMode: AuthModeEnum;
  readonly refresh?: boolean;
}
