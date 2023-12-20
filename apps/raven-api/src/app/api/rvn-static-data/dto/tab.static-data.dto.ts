import { Comparable } from '../interfaces/comparable';

export class TabStaticData implements Comparable<TabStaticData> {
  public correspondingEntity: string = 'TabEntity';
  public constructor(
    public id: string,
    public name: string,
    public order: number,
    public pipelineStageIds: string[],
    public relatedFieldIds: string[],
    public relatedTemplateIds: string[],
    public templateId?: string,
  ) {}

  public isSame(other: TabStaticData): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.order === other.order &&
      this.compareArray(this.pipelineStageIds, other.pipelineStageIds) &&
      this.compareArray(this.relatedFieldIds, other.relatedFieldIds) &&
      this.compareArray(this.relatedTemplateIds, other.relatedTemplateIds)
    );
  }

  public unsetNested(): void {}

  private compareArray(thisArray: string[], otherArray: string[]): boolean {
    return (
      thisArray.length === otherArray.length &&
      thisArray.every((value, index) => value === otherArray[index]) &&
      otherArray.every((value, index) => value === thisArray[index])
    );
  }
}
