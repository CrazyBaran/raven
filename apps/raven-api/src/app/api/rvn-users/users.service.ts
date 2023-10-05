import { Brackets, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserData } from '@app/rvns-api';
import { EnqueueJobEvent } from '@app/rvns-bull';

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AclService } from '../rvn-acl/acl.service';
import { ShareTeamEntity } from '../rvn-acl/entities/share-team.entity';
import {
  COMM_SEND_EMAIL_QUEUE__SEND,
  CommSendEmailJobData,
} from '../rvn-comm/queues/comm-send-email/comm-send-email.processor';
import { CommEmailTemplatesEnum } from '../rvn-comm/templates/comm-email-templates.enum';
import { TeamEntity } from '../rvn-teams/entities/team.entity';
import { UserEntity } from './entities/user.entity';

interface ListOptions {
  readonly ids?: string[];
  readonly search?: string;
  readonly user?: UserData;
  readonly userSameTeamOnly?: boolean;
}

interface CreateOptions {
  readonly azureId: string;
  readonly name: string;
  readonly team: TeamEntity;
}

export const CACHE_USER_ORM_PROFILE = 'cache.user-orm.profile:';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly aclService: AclService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async list(options: ListOptions): Promise<UserEntity[]> {
    const qb = this.usersRepository.createQueryBuilder('u');
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
    const user = await this.usersRepository.manager.transaction(async (em) => {
      let user = new UserEntity();
      user.azureId = options.azureId;
      user.email = email;
      user.name = options.name;
      user = await em.save(user);
      return user;
    });
    await this.enqueueWelcomeEmail(user);
    return user;
  }

  public async entityToResponseData(
    user: UserEntity | UserData,
  ): Promise<UserData> {
    const team = await this.getUserTeam(user, true);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      teamId: team ? team.id : null,
    };
  }

  protected async enqueueWelcomeEmail(user: UserEntity): Promise<void> {
    const team = await this.getUserTeam(user);
    const jobId = `jid:${uuidv4()}`;
    this.eventEmitter.emit(
      `ms.bg.enqueue.${COMM_SEND_EMAIL_QUEUE__SEND}`,
      new EnqueueJobEvent<CommSendEmailJobData>(
        {
          template: CommEmailTemplatesEnum.WELCOME_ACTIVATE,
          templateArgs: {},
          subject: 'Welcome to the Platform! Start Your Journey Right Away!',
          recipients: {
            to: [{ address: user.email, displayName: user.name }],
          },
        },
        {
          jobId,
          group: { id: team?.id },
        },
      ),
    );
  }
}
