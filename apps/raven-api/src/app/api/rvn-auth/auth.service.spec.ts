import { Request as ExpressRequest } from 'express';
import { EntityManager, Repository } from 'typeorm';

import { CryptoHelper } from '@app/rvnb-crypto';
import { AuthModeEnum, UserData } from '@app/rvns-api';

import { environment } from '../../../environments/environment';
import { AclService } from '../rvn-acl/acl.service';
import { TeamEntity } from '../rvn-teams/entities/team.entity';
import { TeamsService } from '../rvn-teams/teams.service';
import { UsersSessionsService } from '../rvn-users-sessions/users-sessions.service';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { UsersService } from '../rvn-users/users.service';
import { UsersServiceLogger } from '../rvn-users/users.service.logger';
import { AuthService } from './auth.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let repository: Repository<UserEntity>;
  let qbMock: SelectQueryBuilder<UserEntity>;

  beforeEach(async () => {
    const defaultUser = {
      id: 'uuid-u',
      name: 'John Doe',
      email: 'fooman@curvestone.io',
      roles: [],
      activated: true,
      suspended: false,
      active: true,
      team: { id: 'uuid-t', domain: 'example.com', idpManaged: true },
    } as unknown as UserEntity;

    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register(environment.security.jwt)],
      providers: [
        AuthService,
        UsersService,
        {
          provide: EntityManager,
          useValue: {
            update: jest.fn(),
            connection: { queryResultCache: { remove: jest.fn() } },
          },
        },
        {
          provide: UsersSessionsService,
          useValue: {
            lookup: jest.fn(),
            register: jest.fn().mockResolvedValue({ refresh: 'refreshToken' }),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            findOne: jest.fn().mockResolvedValue(defaultUser),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: AclService,
          useValue: {
            getByActor: jest.fn().mockImplementation(() => {
              const resource = new TeamEntity();
              resource.id = 'team-uuid';
              resource.name = 'team name';
              resource.domain = 'example.com';
              resource.idpManaged = true;
              return [{ resource }];
            }),
          },
        },
        {
          provide: TeamsService,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
        {
          provide: UsersServiceLogger,
          useValue: {},
        },
        {
          provide: CryptoHelper,
          useValue: { encrypt: jest.fn() },
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    repository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    qbMock = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(defaultUser),
    } as unknown as SelectQueryBuilder<UserEntity>;
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(qbMock);
    jest.spyOn(jwtService, 'decode').mockReturnValue({ exp: 1689241446 });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return jwt token for user', async () => {
    const jwtServiceSpy = jest
      .spyOn(jwtService, 'sign')
      .mockReturnValueOnce('refreshToken')
      .mockReturnValueOnce('generatedToken');
    const user = {
      id: 'uuid-u',
      email: 'fooman@curvestone.io',
      roles: [],
    } as UserData;
    const result = await authService.getUserJwt(AuthModeEnum.Login, {
      user: user,
      req: {} as ExpressRequest,
    });
    expect(jwtServiceSpy).toBeCalled();
    expect(result).toEqual({
      accessToken: 'generatedToken',
      refreshToken: 'refreshToken',
    });
  });
});
