import { AuthModeEnum } from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';

export interface JwtPayload {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly roles: RoleEnum[];
  readonly teamName: string;
  readonly teamId: string;
  readonly authMode: AuthModeEnum;
  readonly refresh?: boolean;
}
