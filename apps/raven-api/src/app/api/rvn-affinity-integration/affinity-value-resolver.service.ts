import { AffinityValueType } from '@app/rvns-affinity-integration';
import { AffinityActionType } from './api/dtos/action-type.affinity.dto';
import { AffinityFieldValueChangeDto } from './api/dtos/field-value-change.affinity.dto';
import { AffinityFieldValueEntityDto } from './api/dtos/field-value-entity.affinity.dto';
import { AffinityFieldDto } from './api/dtos/field.affinity.dto';
import { AffinityPersonDto } from './api/dtos/person.affinity.dto';

export class AffinityValueResolverService {
  public static resolveValue(
    fieldDefinition: AffinityFieldDto,
    fieldUpdates: AffinityFieldValueChangeDto[],
    initialState?: AffinityFieldValueEntityDto | AffinityFieldValueEntityDto[],
  ): AffinityFieldValueEntityDto | AffinityFieldValueEntityDto[] {
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
    initialState: AffinityFieldValueEntityDto[] = [],
    fieldUpdate: AffinityFieldValueChangeDto,
  ): AffinityFieldValueEntityDto[] {
    if (fieldUpdate.action_type === AffinityActionType.Create) {
      return [...initialState, fieldUpdate.value];
    }
    if (fieldUpdate.action_type === AffinityActionType.Delete) {
      return initialState.filter(
        (value) =>
          (value as AffinityPersonDto).id !==
          (fieldUpdate.value as AffinityPersonDto).id,
      );
    }
    return initialState;
  }
}
