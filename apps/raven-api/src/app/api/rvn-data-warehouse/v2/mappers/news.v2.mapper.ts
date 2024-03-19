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
