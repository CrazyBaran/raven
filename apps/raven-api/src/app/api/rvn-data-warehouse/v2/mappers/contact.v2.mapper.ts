import { ContactDto, exposedContactData } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { MapperBase } from '../../interfaces/mapper.base';
import { DataWarehouseParser } from '../../utils/data-warehouse.parser';
import { ContactV2DwhEntity } from '../entities/contact.v2.dwh.entity';

@Injectable()
export class ContactV2Mapper extends MapperBase<
  ContactV2DwhEntity,
  ContactDto
> {
  public constructor() {
    super();
    this.exposedData = exposedContactData;
  }

  protected buildObject(entity: ContactV2DwhEntity): ContactDto {
    return {
      domain: entity.domain,
      name: entity.name,
      email: entity.email,
      positions: DataWarehouseParser.parseSemicolonData(entity.positions),
    };
  }
}
