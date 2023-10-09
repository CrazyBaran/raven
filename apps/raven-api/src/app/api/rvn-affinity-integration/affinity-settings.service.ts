import { Injectable } from '@nestjs/common';
import { environment } from '../../../environments/environment';

@Injectable()
export class AffinitySettingsService {
  public getListSettings(): { list_id: number; field_id: number } {
    const list_id = parseInt(environment.affinity.listId);
    const field_id = parseInt(environment.affinity.fieldId);

    if (!list_id || !field_id) {
      throw new Error('Affinity settings not found');
    }

    return { list_id, field_id };
  }
}
