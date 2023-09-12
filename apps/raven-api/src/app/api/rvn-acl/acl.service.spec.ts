import { EntityManager } from 'typeorm';

import { UserEntity } from '../rvn-users/entities/user.entity';
import { AclService } from './acl.service';
import { AclServiceLogger } from './acl.service.logger';
import { AbilityCache } from './casl/ability.cache';
import { AbstractShareEntity } from './entities/abstract-share.entity';
import { ShareTeamEntity } from './entities/share-team.entity';
import { Test, TestingModule } from '@nestjs/testing';

describe('AclService', () => {
  let service: AclService;
  let entityManager: EntityManager;
  let actorMock: UserEntity;
  let shareMock: AbstractShareEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AclService,
        {
          provide: EntityManager,
          useValue: { find: jest.fn(), remove: jest.fn() },
        },
        {
          provide: AbilityCache,
          useValue: {},
        },
        {
          provide: AclServiceLogger,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AclService>(AclService);
    entityManager = module.get<EntityManager>(EntityManager);
    actorMock = jest.genMockFromModule<UserEntity>(
      '../rvn-users/entities/user.entity',
    );
    actorMock.id = 'uuid-a';
    shareMock = jest.genMockFromModule<AbstractShareEntity>(
      './entities/abstract-share.entity',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getByActor', () => {
    it('should return shares for actor', async () => {
      // Arrange
      const actor = actorMock;
      shareMock.actor = actor;
      jest
        .spyOn(entityManager, 'find')
        .mockResolvedValueOnce([shareMock])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      const result = await service.getByActor(actor.id);

      // Assert
      expect(result).toStrictEqual([shareMock]);
      expect(entityManager.find).toHaveBeenNthCalledWith(1, ShareTeamEntity, {
        where: { actorId: actor.id },
        relations: [],
        withDeleted: false,
      });
    });
  });
});
