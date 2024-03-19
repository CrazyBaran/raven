import { exposedNewsData, NewsDto } from '@app/shared/data-warehouse';
import { Injectable } from '@nestjs/common';
import { MapperBase } from '../../interfaces/mapper.base';
import { NewsV2DwhEntity } from '../entities/news.v2.dwh.entity';

@Injectable()
export class NewsV2Mapper extends MapperBase<NewsV2DwhEntity, NewsDto> {
  public constructor() {
    super();
    this.exposedData = exposedNewsData;
  }

  public mapMany(entities: NewsV2DwhEntity[]): Partial<NewsDto>[] {
    const mappedEntities = super.mapMany(entities);
    return mappedEntities.sort((a, b) => {
      if (a.publicationDate < b.publicationDate) return -1;
      if (a.publicationDate > b.publicationDate) return 1;
      return 0;
    });
  }

  protected buildObject(entity: NewsV2DwhEntity): NewsDto {
    return {
      domain: entity.domain,
      title: entity.title,
      publicationDate: entity.publicationDate,
      newsArticleUrl: entity.newsArticleUrl,
      newsArticleImageUrl: entity.newsArticleImageUrl,
    };
  }
}
