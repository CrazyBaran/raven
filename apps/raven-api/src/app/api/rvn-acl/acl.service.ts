import { EntityManager } from 'typeorm';

import { ShareData, ShareRole } from '@app/rvns-acl';
import { UserData } from '@app/rvns-api';

import { BadRequestException, Injectable } from '@nestjs/common';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { TeamEntity } from '../rvn-teams/entities/team.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { AbilityCache } from './casl/ability.cache';
import { ShareResourceId } from './contracts/share-resource-id.interface';
import { ShareResource } from './contracts/share-resource.interface';
import { AbstractShareEntity } from './entities/abstract-share.entity';
import { ShareOpportunityEntity } from './entities/share-opportunity.entity';
import { ShareTeamEntity } from './entities/share-team.entity';
import { ShareResourceCode } from './enums/share-resource-code.enum';

interface GetByActorOptions {
  readonly shareEntities?: (typeof ShareTeamEntity)[];
  readonly relations?: ShareEntityRelation[];
  readonly withDeleted?: boolean;
}

export interface ShareOptions {
  resource: ShareResource;
  entityManager?: EntityManager;
  verifyActorTeam?: string;
  invalidateCache?: boolean;
}

export type ShareEntityRelation = 'resource' | 'actor';

@Injectable()
export class AclService {
  public constructor(
    private readonly entityManager: EntityManager,
    private readonly cache: AbilityCache,
    private readonly logger: RavenLogger,
  ) {
    this.logger.setContext(AclService.name);
  }

  public async getByActor(
    actorId: string,
    options?: GetByActorOptions,
  ): Promise<AbstractShareEntity[]> {
    const shareEntities = options?.shareEntities || [
      ShareTeamEntity,
      ShareOpportunityEntity,
    ];
    const shares = [];
    for (const entityClass of shareEntities) {
      shares.push(
        ...(await this.entityManager.find(entityClass, {
          where: { actorId },
          relations: options?.relations || [],
          withDeleted: options?.withDeleted || false,
        })),
      );
    }
    return shares;
  }

  public getByResource(
    resource: string | ShareResource,
    actorId?: string,
    entityManager?: EntityManager,
  ): Promise<AbstractShareEntity[]> {
    const parsedRes = this.parseCompoundId(resource);
    const qb = (entityManager || this.entityManager)
      .createQueryBuilder(parsedRes.shareEntityClass, 's')
      .innerJoinAndSelect('s.actor', 'a')
      .where('s.resourceId = :resourceId', { resourceId: parsedRes.id });
    if (actorId) {
      qb.andWhere('a.id = :actorId', { actorId });
    }
    return qb.getMany();
  }

  public getByResources(
    resources: string[] | ShareResource[],
    actorId?: string,
    entityManager?: EntityManager,
  ): Promise<AbstractShareEntity[]> {
    const shareEntityClass = this.parseCompoundId(
      resources[0],
    ).shareEntityClass;
    const resourceIds = resources.map(
      (resource) => this.parseCompoundId(resource).id,
    );
    const qb = (entityManager || this.entityManager)
      .createQueryBuilder(shareEntityClass, 's')
      .innerJoinAndSelect('s.actor', 'a')
      .where('s.resourceId IN (:...ids)', { ids: resourceIds });
    if (actorId) {
      qb.andWhere('a.id = :actorId', { actorId });
    }
    return qb.getMany();
  }

  public async shareById<T extends AbstractShareEntity>(
    actorId: string,
    role: ShareRole,
    options?: ShareOptions,
  ): Promise<T> {
    return this.share(
      await this.entityManager.findOne(UserEntity, { where: { id: actorId } }),
      role,
      options,
    );
  }

  public async share<T extends AbstractShareEntity>(
    actor: UserEntity,
    role: ShareRole,
    options: ShareOptions,
  ): Promise<T> {
    try {
      if (options.verifyActorTeam) {
        const actorTeam = (
          await this.getByActor(actor.id, {
            shareEntities: [ShareTeamEntity],
            relations: ['resource'],
          })
        )[0]?.resource as TeamEntity;
        if (!actorTeam || actorTeam.id !== options.verifyActorTeam) {
          throw new Error('Actor does not match to the resource team');
        }
      }
      let share = this.shareEntityFactory(options.resource) as T;
      const existingShare = await this.getByResource(
        share.resource,
        actor.id,
        options.entityManager,
      );
      if (existingShare.length === 1) {
        // update role only if different
        if (existingShare[0].role === role) {
          return existingShare[0] as T;
        }
        const oldRole = existingShare[0].role;
        existingShare[0].role = role;
        const result = (await (
          options.entityManager || this.entityManager
        ).save(existingShare[0])) as T;
        const actionName = this.isHigherRole(role, oldRole)
          ? 'Upgraded'
          : 'Downgraded';
        this.logger.log(
          `${actionName} share on resource ${share.resource.id} for user ${actor.email} from ${oldRole} to ${role}`,
          'AclService.share',
        );
        return result;
      }
      share.role = role;
      share.actor = actor;
      share = await (options.entityManager || this.entityManager).save(share);
      this.logger.log(
        `Added share to resource ${share.resource.id} for user ${actor.email} as ${role}`,
        'AclService.share',
      );
      return share;
    } finally {
      !options.invalidateCache || (await this.cache.invalidate(actor.id));
    }
  }

  public async revoke(share: AbstractShareEntity): Promise<void> {
    const parsedRes = this.parseCompoundId(
      `${share.resourceCode}-${share.resourceId}`,
    );
    if (share.role === ShareRole.Owner) {
      const ownersCount = await this.entityManager.count(
        parsedRes.shareEntityClass,
        {
          where: { resourceId: share.resourceId, role: ShareRole.Owner },
        },
      );
      if (ownersCount === 1) {
        throw new BadRequestException(
          'It is not possible to remove last owner of the space',
        );
      }
    }
    await this.entityManager.remove(parsedRes.shareEntityClass, share);
    this.logger.log(
      `Revoked access to resource ${share.resourceId} for user ${share.actor?.email} as ${share.role}`,
      'AclService.revoke',
    );
    await this.cache.invalidate(share.actorId);
  }

  public async isOwnerForResource(
    resource: ShareResource,
    identity: UserData,
  ): Promise<boolean> {
    const userShares = await this.getByResource(resource, identity.id);
    return userShares.every((s) => s.role === ShareRole.Owner);
  }

  public async invalidateCacheForUser(userId: string): Promise<void> {
    await this.cache.invalidate(userId);
  }

  public entityToResponseData(share: AbstractShareEntity): ShareData {
    return {
      id: `${share.resourceCode}-${share.id}`,
      resourceId: `${share.resourceCode}-${share.resourceId}`,
      actorId: share.actor.id,
      actorName: share.actor.name,
      actorEmail: share.actor.email,
      role: share.role,
    };
  }

  public parseCompoundId(resource: string | ShareResource): ShareResourceId {
    const resourceId =
      typeof resource === 'string'
        ? resource
        : this.shareEntityToResourceId(resource);
    const resCode = resourceId.charAt(0) as ShareResourceCode;
    if (
      Object.values(ShareResourceCode).includes(resCode) &&
      resourceId.charAt(1) === '-'
    ) {
      let shareEntityClass = null;
      let shareResourceEntityClass = null;
      switch (resCode) {
        case ShareResourceCode.Team:
          shareEntityClass = ShareTeamEntity;
          shareResourceEntityClass = TeamEntity;
          break;
        case ShareResourceCode.Opportunity:
          shareEntityClass = ShareOpportunityEntity;
          shareResourceEntityClass = OpportunityEntity;
          break;
      }
      return {
        id: resourceId.substring(2),
        code: resCode,
        shareEntityClass,
        shareResourceEntityClass,
      };
    }
    return null;
  }

  protected shareEntityFactory(
    resource: ShareResource,
  ): AbstractShareEntity | null {
    let share = null;
    if (resource instanceof TeamEntity) {
      share = new ShareTeamEntity();
    } else if (resource instanceof OpportunityEntity) {
      share = new ShareOpportunityEntity();
    }
    if (share) {
      share.resource = resource;
    }
    return share;
  }

  protected shareEntityToResourceId(resource: ShareResource): string {
    let code = null;
    if (resource instanceof TeamEntity) {
      code = ShareResourceCode.Team;
    } else if (resource instanceof OpportunityEntity) {
      code = ShareResourceCode.Opportunity;
    }
    return `${code}-${resource.id}`;
  }

  protected isHigherRole(role: ShareRole, referenceRole: ShareRole): boolean {
    const rolesPriorityOrder = [
      ShareRole.Owner,
      ShareRole.Editor,
      ShareRole.Viewer,
    ];
    return (
      rolesPriorityOrder.indexOf(role) <
      rolesPriorityOrder.indexOf(referenceRole)
    );
  }
}
