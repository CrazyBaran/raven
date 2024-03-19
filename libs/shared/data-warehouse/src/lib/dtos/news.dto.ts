export class NewsDto {
  public domain: string;
  public title: string;
  public publicationDate: Date;
  public newsArticleUrl: string;
  public newsArticleImageUrl: string;
}

export const exposedNewsData: Partial<keyof NewsDto>[] = [
  'domain',
  'title',
  'publicationDate',
  'newsArticleUrl',
  'newsArticleImageUrl',
];
