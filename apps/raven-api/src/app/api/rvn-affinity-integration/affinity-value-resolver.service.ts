import { AffinityValueType } from '@app/rvns-affinity-integration';
import { ActionType } from './api/dtos/action-type.dto';
import { FieldValueChangeDto } from './api/dtos/field-value-change.dto';
import { FieldValueEntityDto } from './api/dtos/field-value-entity.dto';
import { FieldDto } from './api/dtos/field.dto';
import { PersonDto } from './api/dtos/person.dto';

export class AffinityValueResolverService {
  public static resolveValue(
    fieldDefinition: FieldDto,
    fieldUpdates: FieldValueChangeDto[],
    initialState?: FieldValueEntityDto | FieldValueEntityDto[],
  ): FieldValueEntityDto | FieldValueEntityDto[] {
    if (
      fieldDefinition.value_type === AffinityValueType.Person &&
      fieldDefinition.allows_multiple
    ) {
      return fieldUpdates.reduce(
        AffinityValueResolverService.multiplePersonValueReducer,
        initialState || [],
      );
    }
  }

  private static multiplePersonValueReducer(
    initialState: FieldValueEntityDto[] = [],
    fieldUpdate: FieldValueChangeDto,
  ): FieldValueEntityDto[] {
    if (fieldUpdate.action_type === ActionType.Create) {
      return [...initialState, fieldUpdate.value];
    }
    if (fieldUpdate.action_type === ActionType.Delete) {
      return initialState.filter(
        (value) =>
          (value as PersonDto).id !== (fieldUpdate.value as PersonDto).id,
      );
    }
    return initialState;
  }
}
