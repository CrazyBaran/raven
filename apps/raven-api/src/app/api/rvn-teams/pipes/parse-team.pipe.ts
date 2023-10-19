import { Injectable } from '@nestjs/common';
import { AbstractEntityPipe } from '../../../shared/pipes/abstract-entity.pipe';
import { TeamEntity } from '../entities/team.entity';

@Injectable()
export class ParseTeamPipe extends AbstractEntityPipe<TeamEntity> {
  public readonly entityClass = TeamEntity;
  public readonly resource = 'team';
}
