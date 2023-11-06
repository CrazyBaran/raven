import { AffinityValueType } from '@app/rvns-affinity-integration';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { ActionType } from './api/dtos/action-type.dto';
import { FieldValueChangeDto } from './api/dtos/field-value-change.dto';
import { FieldDto } from './api/dtos/field.dto';
import { PersonDto } from './api/dtos/person.dto';

describe('AffinityValueResolverService', () => {
  describe('resolveValue for multiple person type', () => {
    const fieldDefinition = {
      value_type: AffinityValueType.Person,
      allows_multiple: true,
    };
    it('create when empty initial value', async () => {
      const fieldUpdates = [
        {
          action_type: ActionType.Create,
          value: {
            id: 1,
          },
        },
      ];

      const result = AffinityValueResolverService.resolveValue(
        fieldDefinition as FieldDto,
        fieldUpdates as FieldValueChangeDto[],
      );

      const expected = [
        {
          id: 1,
        },
      ];

      expect(result).toStrictEqual(expected);
    });

    it('create when initial value', async () => {
      const fieldUpdates = [
        {
          action_type: ActionType.Create,
          value: {
            id: 1,
          },
        },
      ];
      const initialState = [
        {
          id: 2,
        } as PersonDto,
      ];

      const result = AffinityValueResolverService.resolveValue(
        fieldDefinition as FieldDto,
        fieldUpdates as FieldValueChangeDto[],
        initialState,
      );

      const expected = [
        {
          id: 2,
        },
        {
          id: 1,
        },
      ];

      expect(result).toStrictEqual(expected);
    });
    it('delete when initial value', async () => {
      const fieldUpdates = [
        {
          action_type: ActionType.Delete,
          value: {
            id: 1,
          },
        },
      ];
      const initialState = [
        {
          id: 1,
        } as PersonDto,
        {
          id: 2,
        } as PersonDto,
      ];

      const result = AffinityValueResolverService.resolveValue(
        fieldDefinition as FieldDto,
        fieldUpdates as FieldValueChangeDto[],
        initialState,
      );

      const expected = [
        {
          id: 2,
        },
      ];

      expect(result).toStrictEqual(expected);
    });
  });
});
