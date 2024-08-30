import { OrganisationData } from '@app/rvns-opportunities';

import {
  FundManagerData,
  KeyRelationship,
  PagedFundManagerData,
} from '@app/rvns-fund-managers';
import { TagData } from '@app/rvns-tags';
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Currency, FundManagerRelationStrength, PagedData } from 'rvns-shared';
import { FundManagerEntity } from './entities/fund-manager.entity';

export class FundManagerRO implements FundManagerData {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public domain: string;
  @ApiProperty()
  public description: string;
  @ApiProperty()
  public strategy: string;
  @ApiProperty()
  public geography: string;
  @ApiProperty()
  public avgCheckSize: number;
  @ApiProperty()
  public avgCheckSizeCurrency: Currency;
  @ApiProperty()
  public aum: number;
  @ApiProperty()
  public aumCurrency: Currency;
  @ApiProperty()
  public isPortfolio: boolean;
  @ApiProperty()
  public createdAt: Date;
  @ApiProperty()
  public updatedAt: Date;
  @ApiProperty()
  public keyRelationships: KeyRelationship[];
  @ApiProperty()
  public organisations: OrganisationData[];
  @ApiProperty()
  public industryTags: TagData[];
  @ApiProperty()
  public relationStrength: FundManagerRelationStrength;

  public static createFromEntity(entity: FundManagerEntity): FundManagerData {
    return plainToInstance(FundManagerRO, {
      ...entity,
    });
  }

  public static createFromArray = (
    array: FundManagerEntity[],
  ): FundManagerData[] => array?.map(FundManagerRO.createFromEntity);
}

export class PagedFundManagerRO implements PagedData<FundManagerRO> {
  @ApiProperty()
  public total: number;
  @ApiProperty({
    type: FundManagerRO,
    default: [],
  })
  public items: FundManagerRO[];

  public static createFromPagedData = (
    pagedData: PagedData<FundManagerEntity>,
  ): PagedFundManagerData => ({
    total: pagedData.total,
    items: pagedData?.items.map(FundManagerRO.createFromEntity),
  });
}
