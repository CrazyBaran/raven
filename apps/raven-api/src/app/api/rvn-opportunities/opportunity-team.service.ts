import { ShareRole } from '@app/rvns-acl';
import { OpportunityTeamData } from '@app/rvns-opportunities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AclService } from '../rvn-acl/acl.service';
import { AbstractShareEntity } from '../rvn-acl/entities/abstract-share.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { OpportunityEntity } from './entities/opportunity.entity';

@Injectable()
export class OpportunityTeamService {
  public constructor(private readonly aclService: AclService) {}

  public async getOpportunityTeam(
    opportunity: OpportunityEntity,
  ): Promise<OpportunityTeamData> {
    const opportunityTeam = await this.aclService.getByResource(opportunity);

    return this.entityToResponseData(opportunityTeam);
  }

  public async assignTeamMember(
    opportunity: OpportunityEntity,
    user: UserEntity,
    role: ShareRole,
  ): Promise<OpportunityTeamData> {
    await this.aclService.share(user, role, {
      resource: opportunity,
    });

    return this.getOpportunityTeam(opportunity);
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

    return this.getOpportunityTeam(opportunity);
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
