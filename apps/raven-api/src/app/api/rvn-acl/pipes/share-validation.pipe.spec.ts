import { AuthorizationService } from '../authorization.service';
import { ShareAction } from '../enums/share-action.enum';
import { ShareValidationPipe } from './share-validation.pipe';
import { Test, TestingModule } from '@nestjs/testing';

describe('ShareValidationPipe', () => {
  let pipe: ShareValidationPipe;
  let authService: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShareValidationPipe,
        {
          provide: AuthorizationService,
          useValue: {
            authorize: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: 'REQUEST',
          useValue: {
            method: 'GET',
            user: {
              email: 'test@curvestone.io',
            },
          },
        },
      ],
    }).compile();

    pipe = await module.resolve<ShareValidationPipe>(ShareValidationPipe);
    authService = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('validate', () => {
    it('should validate resource and action', async () => {
      // Arrange
      const user = { email: 'test@curvestone.io' };
      const resource = 'p-1';
      const action = ShareAction.View;
      const authorizeSpy = jest.spyOn(authService, 'authorize');

      // Act
      await pipe.validate(resource, action);

      // Assert
      expect(authorizeSpy).toHaveBeenNthCalledWith(
        1,
        user,
        ShareAction.View,
        'p-1'
      );
    });

    it('should validate resource and action from method', async () => {
      // Arrange
      const user = { email: 'test@curvestone.io' };
      const resource = 'p-1';
      const authorizeSpy = jest.spyOn(authService, 'authorize');

      // Act
      await pipe.validate(resource);

      // Assert
      expect(authorizeSpy).toHaveBeenNthCalledWith(
        1,
        user,
        ShareAction.View,
        'p-1'
      );
    });
  });
});
