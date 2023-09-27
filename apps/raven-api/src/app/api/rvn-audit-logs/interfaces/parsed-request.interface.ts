import { HttpMethodEnum } from '../../../shared/enum/http-method.enum';

export interface ParsedRequest {
  readonly module: string;
  readonly query: string | null;
  readonly body: Record<string, unknown> | null;
  readonly httpMethod: HttpMethodEnum;
  readonly controller: string;
  readonly token: string | null;
}
