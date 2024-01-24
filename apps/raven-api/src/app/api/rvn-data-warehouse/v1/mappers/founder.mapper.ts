import { FounderDto } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { GroupedEntity } from '../../interfaces/grouped-entity.interface';
import { FounderDwhEntity } from '../entities/founder.dwh.entity';

@Injectable()
export class FounderMapper {
  public mapMany(
    grouped: GroupedEntity<FounderDwhEntity>[],
  ): (FounderDto[] | FounderDto)[] {
    return grouped.map((founders) => {
      return this.mapOneOrMany(founders);
    });
  }

  public mapOneOrMany(
    grouped: GroupedEntity<FounderDwhEntity>,
  ): FounderDto[] | FounderDto {
    if (grouped.entities.length > 1) {
      return grouped.entities.map((founder) => {
        return this.mapOne(founder);
      });
    } else if (grouped.entities.length === 1) {
      return this.mapOne(grouped.entities[0]);
    } else {
      return [];
    }
  }

  public mapOne(founder: FounderDwhEntity): FounderDto {
    return {
      founderId: founder.founderId,
      name: founder.name,
      founderType: founder.founderType,
    };
  }
}
