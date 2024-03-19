import { Entity, PrimaryColumn } from 'typeorm';
import { DWH_V2_SCHEMA } from '../data-warehouse.v2.const';

@Entity({
  name: DWH_V2_SCHEMA.views.news.name,
  schema: DWH_V2_SCHEMA.schemaName,
})
export class NewsV2DwhEntity {
  @PrimaryColumn({ name: 'Domain', type: 'varchar', length: 300 })
  public domain: string;

  @PrimaryColumn({ name: 'Title', type: 'nvarchar', length: 200 })
  public title: string;

  @PrimaryColumn({ name: 'Publication Datetime (UTC)', type: 'datetime' })
  public publicationDate: Date;

  @PrimaryColumn({ name: 'Summary', type: 'nvarchar', length: 'MAX' })
  public summary: string;

  @PrimaryColumn({ name: 'Content', type: 'nvarchar', length: 'MAX' })
  public content: string;

  @PrimaryColumn({ name: 'News Article URL', type: 'varchar', length: 'MAX' })
  public newsArticleUrl: string;

  @PrimaryColumn({
    name: 'News Article Image URL',
    type: 'varchar',
    length: 'MAX',
  })
  public newsArticleImageUrl: string;
}

export const DWH_V2_NEWS_SELECT_COLUMNS: Partial<keyof NewsV2DwhEntity>[] = [
  'domain',
  'title',
  'publicationDate',
  'newsArticleUrl',
  'newsArticleImageUrl',
];
