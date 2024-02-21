import { ClsStore } from 'nestjs-cls';

export interface AuthClsStore extends ClsStore {
  localAccountId: string;
  accessToken: string;
  name: string;
  email: string;
}
