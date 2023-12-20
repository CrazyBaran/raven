import { Comparable } from '../interfaces/comparable';

export class FieldDefinitionStaticData
  implements Comparable<FieldDefinitionStaticData>
{
  public correspondingEntity: string = 'FieldDefinitionEntity';
  public constructor(
    public id: string,
    public name: string,
    public type: string,
    public order: number,
    public configuration: string,
    public fieldGroupId?: string,
  ) {}

  public isSame(other: FieldDefinitionStaticData): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.type === other.type &&
      this.order === other.order &&
      this.configuration === other.configuration
    );
  }

  public unsetNested(): void {}
}
