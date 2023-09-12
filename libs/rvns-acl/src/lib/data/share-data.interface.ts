import { ShareRole } from '../share-role.enum';

export interface ShareData {
  readonly id: string;
  readonly resourceId: string;
  readonly actorId: string;
  readonly actorName: string;
  readonly actorEmail: string;
  readonly role: ShareRole;
}
