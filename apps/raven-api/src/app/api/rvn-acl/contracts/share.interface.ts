import { ShareRole } from '@app/rvns-acl';

export interface Share {
  readonly resourceId: string;
  readonly resourceCode: string;
  readonly role: ShareRole;
}
