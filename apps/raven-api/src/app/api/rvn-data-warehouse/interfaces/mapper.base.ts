import { pick } from 'lodash';

export abstract class MapperBase<EntityType, DtoType> {
  protected exposedData: Partial<keyof DtoType>[];

  public mapMany(entities: EntityType[]): Partial<DtoType>[] {
    if (!entities) return [];
    return entities.map((entity) => this.map(entity));
  }
  public map(entity: EntityType): Partial<DtoType> {
    if (!entity) return null;
    const mappedObject = this.buildObject(entity);
    return pick(mappedObject, this.exposedData);
  }

  protected abstract buildObject(
    entity: EntityType,
  ): DtoType | Partial<DtoType>;
}
