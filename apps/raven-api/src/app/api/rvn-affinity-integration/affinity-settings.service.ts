import { Injectable } from '@nestjs/common';
import { environment } from '../../../environments/environment';

@Injectable()
export class AffinitySettingsService {
  public getListSettings(): { defaultListId: number; statusFieldId: number } {
    const defaultListId = parseInt(environment.affinity.defaultListId);
    const statusFieldId = parseInt(environment.affinity.statusFieldId);

    if (!defaultListId || !statusFieldId) {
      throw new Error('Affinity settings not found');
    }

    return { defaultListId, statusFieldId };
  }
}
