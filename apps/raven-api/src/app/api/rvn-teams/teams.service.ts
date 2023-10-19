import { EntityManager } from 'typeorm';

import { ShareRole } from '@app/rvns-acl';
import { UserData } from '@app/rvns-api';
import { TeamData, TeamsData } from '@app/rvns-teams';

import { Injectable } from '@nestjs/common';
import { SortOptions } from '../../shared/enum/sort-options.enum';
import { AclService } from '../rvn-acl/acl.service';
import { ShareTeamEntity } from '../rvn-acl/entities/share-team.entity';
import { ShareResourceCode } from '../rvn-acl/enums/share-resource-code.enum';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { TeamEntity } from './entities/team.entity';

export const SortableColumns = ['name', 'createdAt'] as const;
export type SortableColumnsType = (typeof SortableColumns)[number];

interface ListOptions {
  readonly skip?: number;
  readonly take?: number;
  readonly sortDir?: SortOptions;
  readonly sort?: SortableColumnsType;
}

interface CreateOptions {
  readonly owner?: UserEntity;
}

interface UpdateOptions {
  readonly name: string;
}

@Injectable()
export class TeamsService {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly aclService: AclService,
  ) {}

  public async list(user: UserData, options?: ListOptions): Promise<TeamsData> {
    const skip = options?.skip || 0;
    const take = options?.take || 10;
    const preparedSort = options?.sort === 'name' ? 'name' : 'createdAt';
    const preparedSortDir = options?.sortDir || SortOptions.desc;

    const qb = this.entityManager.createQueryBuilder(TeamEntity, 't');

    const [teams, totalAmount] = await qb
      .skip(skip)
      .take(take)
      .orderBy(`t.${preparedSort}`, preparedSortDir)
      .getManyAndCount();

    return {
      total: totalAmount,
      items: await Promise.all(
        teams.map((team) => this.entityToResponseData(team)),
      ),
    };
  }

  public async create(
    name: string,
    options?: CreateOptions,
  ): Promise<TeamEntity> {
    if (
      (await this.entityManager.findOne(TeamEntity, {
        where: { name },
        withDeleted: true,
      })) !== null
    ) {
      throw new Error('Team with the same name already exists');
    }
    return this.entityManager.transaction(async (em) => {
      let teamEntity = new TeamEntity();
      teamEntity.name = name;
      teamEntity = await em.save(teamEntity);
      if (options?.owner) {
        await this.aclService.share(options?.owner, ShareRole.Owner, {
          resource: teamEntity,
          entityManager: em,
        });
      }
      return teamEntity;
    });
  }

  public async update(
    teamEntity: TeamEntity,
    options: UpdateOptions,
  ): Promise<TeamEntity> {
    teamEntity.name = options.name;
    return this.entityManager.save(teamEntity);
  }

  public async remove(teamEntity: TeamEntity): Promise<boolean> {
    await this.entityManager.softRemove(teamEntity);
    teamEntity.name = `${teamEntity.name}#removed#${Date.now()}`;
    await this.entityManager.save(teamEntity);
    return true;
  }

  public async getTeamAdmins(
    teamEntity: TeamEntity,
  ): Promise<ShareTeamEntity[]> {
    return this.entityManager.find(ShareTeamEntity, {
      where: { resourceId: teamEntity.id, role: ShareRole.Owner },
    });
  }

  public async entityToResponseData(teamEntity: TeamEntity): Promise<TeamData> {
    return {
      id: teamEntity.id,
      name: teamEntity.name,
      membersCount: await this.countMembers(teamEntity.id),
      updatedAt: teamEntity.updatedAt,
      createdAt: teamEntity.createdAt,
    };
  }

  protected async countMembers(teamId: string): Promise<number> {
    const shares = await this.aclService.getByResource(
      `${ShareResourceCode.Team}-${teamId}`,
    );
    return shares.length;
  }
}
