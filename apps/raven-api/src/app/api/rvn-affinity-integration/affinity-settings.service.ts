import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AffinitySettingsService {
  public constructor(private readonly configService: ConfigService) {}

  public getListSettings(): { list_id: number; field_id: number } {
    const list_id = parseInt(this.configService.get('AFFINITY_LIST_ID'));
    const field_id = parseInt(this.configService.get('AFFINITY_FIELD_ID'));

    if (!list_id || !field_id) {
      throw new Error('Affinity settings not found');
    }

    return { list_id, field_id };
  }
}
