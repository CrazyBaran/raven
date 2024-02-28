import { OrganisationData } from '@app/rvns-opportunities';
import {
  PagedShortlistData,
  PagedShortlistDataWithExtras,
  ShortlistContributor,
  ShortlistData,
  ShortlistStats,
} from '@app/rvns-shortlists';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, plainToInstance } from 'class-transformer';
import { PagedData, PagedDataWithExtras, ShortlistType } from 'rvns-shared';
import { ShortlistEntity } from './entities/shortlist.entity';

export class ShortlistRO implements ShortlistData {
  @Exclude()
  public organisations: OrganisationData[];

  @Exclude()
  public organisationsCount: number;

  @Exclude()
  public inPipelineCount: number;

  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public description: string;

  @ApiProperty({
    type: 'enum',
    enum: ShortlistType,
    default: ShortlistType.CUSTOM,
  })
  public type: ShortlistType;

  @ApiProperty()
  public creatorId: string;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  @ApiProperty()
  public stats: ShortlistStats;

  @ApiProperty()
  public contributors: ShortlistContributor[];

  public static createFromEntity(entity: ShortlistEntity): ShortlistData {
    return plainToInstance(ShortlistRO, {
      ...entity,
      stats: {
        organisationsCount: entity.organisationsCount,
        inPipelineCount: entity.inPipelineCount,
      },
    });
  }

  public static createFromArray = (array: ShortlistEntity[]): ShortlistData[] =>
    array?.map(ShortlistRO.createFromEntity);
}

export class PagedShortlistRO implements PagedData<ShortlistRO> {
  @ApiProperty()
  public total: number;
  @ApiProperty({
    type: ShortlistRO,
    default: [],
  })
  public items: ShortlistRO[];

  public static createFromPagedData = (
    pagedData: PagedData<ShortlistEntity>,
  ): PagedShortlistData => ({
    total: pagedData.total,
    items: pagedData?.items.map(ShortlistRO.createFromEntity),
  });

  public static createFromPagedDataWithExtras = (
    pagedData: PagedDataWithExtras<ShortlistEntity>,
  ): PagedShortlistDataWithExtras => ({
    ...this.createFromPagedData(pagedData),
    extras: pagedData?.extras?.map(ShortlistRO.createFromEntity),
  });
}
