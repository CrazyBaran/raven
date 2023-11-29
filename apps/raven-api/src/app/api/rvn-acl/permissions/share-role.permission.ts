import { ShareRole } from '@app/rvns-acl';

import { ShareAction } from '../enums/share-action.enum';
import { ShareResourceCode } from '../enums/share-resource-code.enum';

type ShareRolePermission = Record<ShareRole, ShareAction[]>;

export const ShareRolePermissions: Record<
  ShareResourceCode,
  ShareRolePermission
> = {
  // team
  t: {
    [ShareRole.Owner]: [
      ShareAction.List,
      ShareAction.View,
      ShareAction.ViewShares,
      ShareAction.Share,
      ShareAction.Edit,
    ],
    [ShareRole.Editor]: [],
    [ShareRole.Viewer]: [],
    [ShareRole.Sharer]: [],
  },
  // opportunity
  o: {
    [ShareRole.Owner]: [
      ShareAction.List,
      ShareAction.View,
      ShareAction.ViewShares,
      ShareAction.Share,
      ShareAction.Edit,
      ShareAction.Delete,
    ],
    [ShareRole.Editor]: [
      ShareAction.List,
      ShareAction.View,
      ShareAction.ViewShares,
      ShareAction.Edit,
    ],
    [ShareRole.Viewer]: [],
    [ShareRole.Sharer]: [],
  },
};
