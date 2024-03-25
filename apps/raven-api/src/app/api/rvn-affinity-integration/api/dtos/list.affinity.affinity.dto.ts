import { AffinityEntityType } from './list-type.affinity.dto';

export class AffinityListDto {
  public id: number;
  public type: AffinityEntityType;
  public name: string;
  public public: boolean;
  public owner_id: number;
  public list_size: number;
}
