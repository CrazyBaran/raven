import { TeamEntity } from '../../rvn-teams/entities/team.entity';
import { ShareResourceCode } from '../enums/share-resource-code.enum';

export interface ResourceConfig {
  [entityType: string]: {
    shareCode: ShareResourceCode;
    idPath: string;
  };
}

export const resourceConfig: ResourceConfig = {
  [TeamEntity.name]: {
    shareCode: ShareResourceCode.Team,
    idPath: 'id',
  },
};
