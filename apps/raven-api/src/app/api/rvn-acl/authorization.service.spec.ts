import { UserData } from '@app/rvns-api';

import { UserEntity } from '../rvn-users/entities/user.entity';
import { AuthorizationService } from './authorization.service';
import { AbilityFactory, ShareAbility } from './casl/ability.factory';
import { ShareAction } from './enums/share-action.enum';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let abilityFactory: AbilityFactory;
  let userMock: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: AbilityFactory,
          useValue: {
            createForUser: jest.fn().mockResolvedValue({
              can: jest.fn().mockReturnValue(true),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
    userMock = jest.genMockFromModule<UserEntity>(
      '../rvn-users/entities/user.entity'
    );
    userMock.id = 'uuid-u';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authorize', () => {
    it("shouldn't throw exception if authorized", async () => {
      // Arrange
      const resource = 'p-1';
      const action = ShareAction.View;

      // Act
      // Assert
      await expect(
        service.authorize(userMock as unknown as UserData, action, resource)
      ).resolves.not.toThrow();
    });

    it('should thrown exception if not authorized', async () => {
      // Arrange
      const resource = 'p-2';
      const action = ShareAction.Delete;
      jest.spyOn(abilityFactory, 'createForUser').mockResolvedValue({
        can: jest.fn().mockReturnValue(false),
      } as unknown as ShareAbility);

      // Act
      // Assert
      await expect(() =>
        service.authorize(userMock as unknown as UserData, action, resource)
      ).rejects.toThrow(
        new ForbiddenException("You don't have sufficient permissions")
      );
    });
  });
});
