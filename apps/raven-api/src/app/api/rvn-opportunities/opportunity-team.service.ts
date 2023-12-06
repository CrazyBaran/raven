import { ShareRole } from '@app/rvns-acl';
import { OpportunityTeamData } from '@app/rvns-opportunities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AclService } from '../rvn-acl/acl.service';
import { AbstractShareEntity } from '../rvn-acl/entities/abstract-share.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { OpportunityEntity } from './entities/opportunity.entity';

export class MemberData {
  public userId: string;
  public role: ShareRole;
}
export class CreateOrModifyTeamOptions {
  public opportunity: OpportunityEntity;
  public members: string[];
  public owners: string[];
}

@Injectable()
export class OpportunityTeamService {
  public constructor(private readonly aclService: AclService) {}

  public async getOpportunityTeam(
    opportunity: OpportunityEntity,
  ): Promise<OpportunityTeamData> {
    const opportunityTeam = await this.aclService.getByResource(opportunity);

    return this.entityToResponseData(opportunityTeam);
  }

  public async getOpportunitiesTeams(
    opportunities: OpportunityEntity[],
  ): Promise<Record<string, OpportunityTeamData>> {
    if (!opportunities || opportunities.length === 0) {
      return {};
    }
    const opportunityTeams =
      await this.aclService.getByResources(opportunities);

    const result = {};
    for (const opportunity of opportunities) {
      result[opportunity.id] = this.entityToResponseData(
        opportunityTeams.filter((team) => team.resourceId === opportunity.id),
      );
    }

    return result;
  }

  public async getOpportunitiesTeamsByIds(
    opportunityIds: string[],
  ): Promise<Record<string, OpportunityTeamData>> {
    const opportunityTeams = await this.aclService.getByResources(
      opportunityIds,
      undefined,
      undefined,
    );

    const result = {};
    for (const opportunityId of opportunityIds) {
      result[opportunityId] = this.entityToResponseData(
        opportunityTeams.filter((team) => team.resourceId === opportunityId),
      );
    }

    return result;
  }

  public async assignTeamMember(
    opportunity: OpportunityEntity,
    user: UserEntity,
    role: ShareRole,
  ): Promise<OpportunityTeamData> {
    await this.aclService.share(user, role, {
      resource: opportunity,
    });

    return await this.getOpportunityTeam(opportunity);
  }

  public async removeTeamMember(
    opportunity: OpportunityEntity,
    user: UserEntity,
  ): Promise<OpportunityTeamData> {
    const share = await this.aclService.getByResource(opportunity, user.id);
    if (!share) {
      throw new BadRequestException(
        `User ${user.id} is not a member of opportunity ${opportunity.id} team`,
      );
    }
    await this.aclService.revoke(share[0]);

    return await this.getOpportunityTeam(opportunity);
  }

  public async modifyTeamMembers(
    options: CreateOrModifyTeamOptions,
  ): Promise<OpportunityTeamData> {
    const opportunityTeam = await this.aclService.getByResource(
      options.opportunity,
    );
    const currentMemberIds = opportunityTeam.map((member) => member.actorId);

    const members = options.members.map((member) => {
      return {
        userId: member,
        role: 'editor',
      } as MemberData;
    });

    const owners = options.owners.map((owner) => {
      return {
        userId: owner,
        role: 'owner',
      } as MemberData;
    });

    const allMembers = [...members, ...owners];

    const newMemberIds = allMembers.map((member) => member.userId);
    const membersToRemove = currentMemberIds.filter(
      (memberId) => !newMemberIds.includes(memberId),
    );

    for (const memberId of membersToRemove) {
      const member = opportunityTeam.find(
        (member) => member.actorId === memberId,
      );
      await this.aclService.revoke(member);
    }

    for (const member of allMembers) {
      const currentMember = opportunityTeam.find(
        (currentMember) => currentMember.actorId === member.userId,
      );
      if (!currentMember || currentMember.role !== member.role) {
        await this.aclService.shareById(member.userId, member.role, {
          resource: options.opportunity,
        });
      }
    }

    return await this.getOpportunityTeam(options.opportunity);
  }

  public entityToResponseData(
    shareEntities: AbstractShareEntity[],
  ): OpportunityTeamData {
    const members = shareEntities.map((member) =>
      this.aclService.entityToResponseData(member),
    );
    return {
      owners: members.filter((member) => member.role === ShareRole.Owner),
      members: members.filter((member) => member.role !== ShareRole.Owner),
    };
  }
}
