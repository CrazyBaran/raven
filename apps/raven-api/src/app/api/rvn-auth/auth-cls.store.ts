import { ClsStore } from 'nestjs-cls';

export interface AuthClsStore extends ClsStore {
  localAccountId: string;
}
