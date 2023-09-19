import { environment } from '../../../environments/environment';

export class Scopes {
  public static apiAccess(): string {
    return environment.scopes.apiAccess;
  }
}
