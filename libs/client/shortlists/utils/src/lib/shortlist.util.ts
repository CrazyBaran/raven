// eslint-disable-next-line @nx/enforce-module-boundaries
import { ShortlistData } from '@app/rvns-shortlists';

export class ShortlistUtil {
  public static findMyShortlistFromExtras = (
    extras?: ShortlistData[],
  ): ShortlistData | undefined => {
    return extras?.find((extra) => extra.type === 'personal');
  };
}
