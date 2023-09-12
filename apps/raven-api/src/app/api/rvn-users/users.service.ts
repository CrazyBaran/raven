import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { CryptoHelper } from '@app/rvnb-crypto';
import { ShareRole } from '@app/rvns-acl';
import { UserData } from '@app/rvns-api';
import { EnqueueJobEvent } from '@app/rvns-bull';
import { RoleEnum } from '@app/rvns-roles';

import { environment } from '../../../environments/environment';
import { AclService } from '../rvn-acl/acl.service';
import { ShareTeamEntity } from '../rvn-acl/entities/share-team.entity';
import {
  COMM_SEND_EMAIL_QUEUE__SEND,
  CommSendEmailJobData,
} from '../rvn-comm/queues/comm-send-email/comm-send-email.processor';
import { CommEmailTemplatesEnum } from '../rvn-comm/templates/comm-email-templates.enum';
import { TeamEntity } from '../rvn-teams/entities/team.entity';
import { TeamsService } from '../rvn-teams/teams.service';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UsersServiceLogger } from './users.service.logger';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

interface ListOptions {
  readonly ids?: string[];
  readonly search?: string;
  readonly user?: UserData;
  readonly userSameTeamOnly?: boolean;
}

interface CreateOptions {
  readonly name: string;
  readonly team: TeamEntity;
  readonly role: RoleEntity;
}

interface UpdateOptions {
  readonly name?: string;
  readonly role?: {
    readonly enum: RoleEnum;
    readonly identity: UserData;
  };
  readonly activate?: true;
  readonly suspend?: boolean;
  readonly idpManaged?: true;
  readonly flushPasswordToken?: true;
}

export const MIN_PASS_LENGTH = 8;
export const CACHE_USER_ORM_PROFILE = 'cache.user-orm.profile:';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly teamsService: TeamsService,
    private readonly aclService: AclService,
    private readonly cryptoHelper: CryptoHelper,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: UsersServiceLogger,
  ) {}

  public async list(options: ListOptions): Promise<UserEntity[]> {
    const qb = this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'r');
    if (options.userSameTeamOnly && options.user) {
      qb.innerJoin(ShareTeamEntity, 'st', 'u.id = st.actorId').where(
        'st.resourceId = :teamId',
        { teamId: options.user.teamId },
      );
    }
    if (options.ids) {
      qb.where('u.id IN (:...ids)', { ids: options.ids });
    }
    if (options.search) {
      qb.andWhere(
        new Brackets((qb) =>
          qb
            .where('u.name LIKE :search', { search: `%${options.search}%` })
            .orWhere('u.email LIKE :search', { search: `%${options.search}%` }),
        ),
      );
    }
    return qb.getMany();
  }

  public async getByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  public async getUserTeam(
    user: string | UserEntity | UserData,
    withDeleted = false,
  ): Promise<TeamEntity> {
    return (
      await this.aclService.getByActor(
        typeof user === 'string' ? user : user.id,
        {
          shareEntities: [ShareTeamEntity],
          relations: ['resource'],
          withDeleted,
        },
      )
    )[0]?.resource as TeamEntity;
  }

  public async create(
    email: string,
    options: CreateOptions,
  ): Promise<UserEntity> {
    const tokenRaw = crypto.randomBytes(32).toString('hex');
    const user = await this.usersRepository.manager.transaction(async (em) => {
      let user = new UserEntity();
      user.email = email;
      user.name = options.name;
      user.roles = [options.role];
      user = await em.save(user);
      await this.aclService.share(
        user,
        options.role.name === RoleEnum.TeamAdmin
          ? ShareRole.Owner
          : ShareRole.Viewer,
        {
          resource: options.team,
          entityManager: em,
        },
      );
      return user;
    });
    await this.enqueueWelcomeEmail(user, tokenRaw, options.team.idpManaged);
    return user;
  }

  public async update(
    user: UserEntity,
    options: UpdateOptions,
  ): Promise<UserEntity> {
    return this.usersRepository.manager.transaction(async (em) => {
      const logMessages = [];
      // remove roles relation for the update operation
      const roles = user.roles;
      delete user.roles;
      if (options.name !== undefined) {
        user.name = options.name;
      }
      if (
        options.role !== undefined &&
        !roles.find((r) => r.name === options.role.enum) &&
        // double check it is not possible to set super admin role
        options.role.enum !== RoleEnum.SuperAdmin
      ) {
        // it is not allowed to change self role to user
        if (
          options.role.identity.id === user.id &&
          options.role.enum === RoleEnum.User
        ) {
          throw new ForbiddenException(
            'You are not authorized to change the self role to user.',
          );
        }
        const changeDirection =
          options.role.enum === RoleEnum.TeamAdmin
            ? 'upscaling'
            : 'downscaling';
        logMessages.push(
          `Updated role ${changeDirection} ${user.email} from ${roles.map(
            (r) => r.name,
          )} to ${options.role.enum}`,
        );
        const roleEntity = await em.findOneBy(RoleEntity, {
          name: options.role.enum,
        });
        roles.length = 0;
        roles.push(roleEntity);
        user.roles = roles;
        await this.aclService.share(
          user,
          options.role.enum === RoleEnum.TeamAdmin
            ? ShareRole.Owner
            : ShareRole.Viewer,
          { resource: await this.getUserTeam(user), entityManager: em },
        );
        this.eventEmitter.emit('user.invalidate-session.all', user);
        user.sessionInvalidated = true;
      }
      if (options.activate !== undefined) {
        user.activated = options.activate;
        if (options.activate) {
          user.activationDate = new Date();
        }
      }
      if (options.suspend !== undefined) {
        user.suspended = options.suspend;
        if (options.suspend) {
          user.suspensionDate = new Date();
        } else {
          user.suspensionDate = null;
        }
      }
      const updatedUser = await em.save(user);
      logMessages.forEach((m) => this.logger.log(m));
      // invalidate profile cache
      await em.connection.queryResultCache.remove([
        `${CACHE_USER_ORM_PROFILE}${user.id}`,
      ]);
      // restore roles
      updatedUser.roles = roles;
      return updatedUser;
    });
  }

  public async remove(user: UserEntity, team: TeamEntity): Promise<void> {
    const userId = user.id;
    if (user.roles.findIndex((r) => r.name === RoleEnum.SuperAdmin) !== -1) {
      throw new BadRequestException('It is not possible to remove super admin');
    }
    const teamAdmins = await this.teamsService.getTeamAdmins(team);
    const isTeamAdmin = teamAdmins.some((ta) => ta.actorId === user.id);
    if (isTeamAdmin && teamAdmins.length <= 1) {
      throw new BadRequestException(
        'It is not possible to remove last owner of the team',
      );
    }
    await this.usersRepository.manager.transaction(
      async (em: EntityManager) => {
        await em.remove(UserEntity, user);
      },
    );
    await this.aclService.invalidateCacheForUser(userId);
  }

  public async entityToResponseData(
    user: UserEntity | UserData,
  ): Promise<UserData> {
    const team = await this.getUserTeam(user, true);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((r) => (r instanceof RoleEntity ? r.name : r)),
      teamId: team ? team.id : null,
      teamName: team
        ? team.deletedAt
          ? team.name.replace(/#removed.+$/, ' (removed)')
          : team.name
        : null,
      teamDomain: team ? team.domain || null : null,
      teamIdPManaged: team ? team.idpManaged : null,
      activated: user.activated,
      suspended: user.suspended,
    };
  }

  protected async enqueueWelcomeEmail(
    user: UserEntity,
    tokenRaw: string,
    idpManaged: boolean,
  ): Promise<void> {
    const team = await this.getUserTeam(user);
    const jobId = `jid:${uuidv4()}`;
    this.eventEmitter.emit(
      `ms.bg.enqueue.${COMM_SEND_EMAIL_QUEUE__SEND}`,
      new EnqueueJobEvent<CommSendEmailJobData>(
        {
          template: CommEmailTemplatesEnum.WELCOME_ACTIVATE,
          templateArgs: {
            raw: {
              ACTIVATE_LINK: `${environment.app.url}/complete-registration${
                idpManaged ? '-idp' : ''
              }?n=${encodeURIComponent(user.name)}`,
            },
            encrypted: { ACTIVATE_TOKEN: tokenRaw },
          },
          subject:
            'Welcome to the Platform! Activate Your Account and Start Your Journey',
          recipients: {
            to: [{ address: user.email, displayName: user.name }],
          },
        },
        {
          jobId,
          group: { id: team.id },
        },
      ),
    );
  }

  protected async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, environment.security.bcryptSaltRounds);
  }
}
