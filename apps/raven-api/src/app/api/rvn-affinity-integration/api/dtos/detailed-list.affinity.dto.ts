import { AffinityFieldDto } from './field.affinity.dto';
import { AffinityListDto } from './list.affinity.affinity.dto';

export class AffinityDetailedListDto extends AffinityListDto {
  public fields: AffinityFieldDto[];
}
