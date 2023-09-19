import { Response } from 'express';

import { ShareData, ShareRole } from '@app/rvns-acl';
import {
  EmptyResponseData,
  GenericResponseSchema,
  UserData,
} from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';

import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { ParseUsersPipe } from '../rvn-users/pipes/parse-users.pipe';
import { AclService } from './acl.service';
import { AuthorizationService } from './authorization.service';
import { ShareAbility } from './casl/ability.factory';
import { ShareResource } from './contracts/share-resource.interface';
import { ListSharesDto } from './dto/list-shares.dto';
import { ShareDto } from './dto/share.dto';
import { AbstractShareEntity } from './entities/abstract-share.entity';
import { ShareAction } from './enums/share-action.enum';
import { CheckShare } from './permissions/share-policy.decorator';
import { ParseShareResourcePipe } from './pipes/parse-share-resource.pipe';
import { ParseShareWithActorPipe } from './pipes/parse-share-with-actor.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiOAuth2(['openid'])
@ApiTags('Acl')
@Controller('acl')
export class AclController {
  public constructor(
    private readonly aclService: AclService,
    private readonly authService: AuthorizationService,
  ) {}

  @ApiOperation({ description: 'List shares' })
  @ApiResponse(GenericResponseSchema())
  @Get()
  @Roles(RoleEnum.User)
  @CheckShare((ability: ShareAbility, context) =>
    ability.can(
      ShareAction.ViewShares,
      (context.query.resourceId as string)?.toString().toLowerCase().charAt(0),
      (context.query.resourceId as string)
        ?.toString()
        .toLowerCase()
        .substring(2),
    ),
  )
  public async list(
    @Query() dto: ListSharesDto,
    @Req() request: Express.Request,
  ): Promise<ShareData[]> {
    return (
      await this.aclService.getByResource(
        request['query']['resourceId'].toString(),
        dto.actorId,
      )
    ).map(this.aclService.entityToResponseData);
  }

  @ApiOperation({ description: 'List profile shares' })
  @ApiResponse(GenericResponseSchema())
  @Get('profile')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.User)
  public async listProfile(
    @Identity() identity: UserData,
  ): Promise<ShareData[]> {
    return (
      await this.aclService.getByActor(identity.id, { relations: ['actor'] })
    ).map(this.aclService.entityToResponseData);
  }

  @ApiOperation({
    description:
      'Share resource with users. ' +
      'Please follow `GET` endpoint description to build valid `resourceId`',
  })
  @ApiResponse(GenericResponseSchema())
  @Post()
  @Roles(RoleEnum.User)
  @CheckShare((ability: ShareAbility, context) =>
    ability.can(
      ShareAction.Share,
      context.body.resourceId?.toLowerCase().charAt(0),
      context.body.resourceId?.toLowerCase().substring(2),
    ),
  )
  public async share(
    @Body()
    dto: ShareDto,
    @Body('resourceId', ParseShareResourcePipe)
    resourceEntity: ShareResource,
    @Body('actors', ParseUsersPipe)
    actors: UserEntity[],
    @Identity() identity: UserData,
  ): Promise<ShareData[]> {
    // only owner should be able to add another owner
    if (
      dto.role === ShareRole.Owner &&
      !(await this.aclService.isOwnerForResource(resourceEntity, identity))
    ) {
      throw new ForbiddenException("You don't have sufficient permissions");
    }
    try {
      return (
        await Promise.all(
          actors.map(async (actor) =>
            this.aclService.share(actor, dto.role, {
              resource: resourceEntity,
              invalidateCache: true,
              verifyActorTeam: identity.teamId,
            }),
          ),
        )
      ).map(this.aclService.entityToResponseData);
    } catch (e) {
      if (e.message) {
        if (e.message.includes('Actor does not match to the resource team')) {
          throw new BadRequestException(e.message);
        }
        if (e.message.includes('Multiple teams per user')) {
          throw new BadRequestException(e.message);
        }
      }
      throw e;
    }
  }

  @ApiOperation({ description: 'Remove share' })
  @ApiParam({ name: 'shareId', type: String })
  @ApiResponse(GenericResponseSchema())
  @Delete(':shareId')
  @Roles(RoleEnum.User)
  public async revoke(
    @Param('shareId', ParseShareWithActorPipe)
    shareEntity: AbstractShareEntity,
    @Identity() identity: UserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmptyResponseData> {
    // only owner should be able to add another owner
    if (
      shareEntity.role === ShareRole.Owner &&
      !(await this.aclService.isOwnerForResource(
        shareEntity.resource,
        identity,
      ))
    ) {
      throw new ForbiddenException("You don't have sufficient permissions");
    }
    const resourceId = `${shareEntity.resourceCode}-${shareEntity.resourceId}`;
    await this.authService.authorize(identity, ShareAction.Share, resourceId);
    await this.aclService.revoke(shareEntity);
    res['endpointExtraLogs'] = shareEntity.actor.email;
  }
}
