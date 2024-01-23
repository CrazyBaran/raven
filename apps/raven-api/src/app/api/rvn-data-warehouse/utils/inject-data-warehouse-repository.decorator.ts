import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataWarehouseDataSourceName } from '../data-warehouse.const';

export const InjectDataWarehouseRepository = (
  entity: EntityClassOrSchema,
): ReturnType<typeof Inject> => {
  return InjectRepository(entity, DataWarehouseDataSourceName);
};
