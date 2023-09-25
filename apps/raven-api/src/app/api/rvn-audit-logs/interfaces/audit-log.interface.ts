import { HttpMethodEnum } from '../../../shared/enum/http-method.enum';
import { ActionTypeEnum } from '../enums/action-type.enum';

export interface AuditLog {
  readonly user: string;
  readonly module: string;
  readonly actionType: ActionTypeEnum;
  readonly actionResult: number;
  readonly query?: string;
  readonly body?: unknown;
  readonly httpMethod: HttpMethodEnum;
  readonly controller: string;
}
