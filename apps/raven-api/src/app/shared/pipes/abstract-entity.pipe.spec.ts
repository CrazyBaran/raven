import { EntityManager } from 'typeorm';

import { AbstractEntityPipe } from './abstract-entity.pipe';
import { NotFoundException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { Test, TestingModule } from '@nestjs/testing';

class FakeEntity {}

class FakePipe extends AbstractEntityPipe<FakeEntity> {
  protected readonly entityClass = FakeEntity;
  protected readonly resource = 'fake';
}

const metadataMockFn = (id: string | undefined): ArgumentMetadata => {
  return {
    type: 'body',
    metatype: String,
    data: id,
  };
};

describe('AbstractEntityPipe', () => {
  let pipe: AbstractEntityPipe<FakeEntity>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FakePipe,
          useClass: FakePipe,
        },
        {
          provide: EntityManager,
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    pipe = module.get<FakePipe>(FakePipe);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should transform id into fake entity object', async () => {
      // Arrange
      const id = 'uuid-value';
      const metadata = metadataMockFn(id);
      const entityMock = new FakeEntity();
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(entityMock);

      // Act
      const result = await pipe.transform(id, metadata);

      // Assert
      expect(result).toBe(entityMock);
    });

    it('should throw an exception if entity was not found', async () => {
      // Arrange
      const id = 'uuid-value';
      const metadata = metadataMockFn(id);
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      // Act and Assert
      await expect(() => pipe.transform(id, metadata)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw an exception if input parameter is missing', async () => {
      // Arrange
      const id = undefined;
      const metadata = metadataMockFn(id);

      // Act and Assert
      await expect(() => pipe.transform(id, metadata)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
