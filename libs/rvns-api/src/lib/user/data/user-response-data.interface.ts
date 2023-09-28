import { AuthModeEnum } from '../../auth/auth-mode.enum';

export interface UserData {
  authMode?: AuthModeEnum;
  id: string;
  name: string;
  email: string;
  teamId: string;
  teamName: string;
  teamDomain: string | null;
  teamIdPManaged: boolean;
}
