import { AffinityValueType } from '@app/rvns-affinity-integration';
import { AffinityValueResolverService } from './affinity-value-resolver.service';
import { AffinityActionType } from './api/dtos/action-type.affinity.dto';
import { AffinityFieldValueChangeDto } from './api/dtos/field-value-change.affinity.dto';
import { AffinityFieldDto } from './api/dtos/field.affinity.dto';
import { AffinityPersonDto } from './api/dtos/person.affinity.dto';

describe('AffinityValueResolverService', () => {
  describe('resolveValue for multiple person type', () => {
    const fieldDefinition = {
      value_type: AffinityValueType.Person,
      allows_multiple: true,
    };
    it('create when empty initial value', async () => {
      const fieldUpdates = [
        {
          action_type: AffinityActionType.Create,
          value: {
            id: 1,
          },
        },
      ];

      const result = AffinityValueResolverService.resolveValue(
        fieldDefinition as AffinityFieldDto,
        fieldUpdates as AffinityFieldValueChangeDto[],
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
          action_type: AffinityActionType.Create,
          value: {
            id: 1,
          },
        },
      ];
      const initialState = [
        {
          id: 2,
        } as AffinityPersonDto,
      ];

      const result = AffinityValueResolverService.resolveValue(
        fieldDefinition as AffinityFieldDto,
        fieldUpdates as AffinityFieldValueChangeDto[],
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
          action_type: AffinityActionType.Delete,
          value: {
            id: 1,
          },
        },
      ];
      const initialState = [
        {
          id: 1,
        } as AffinityPersonDto,
        {
          id: 2,
        } as AffinityPersonDto,
      ];

      const result = AffinityValueResolverService.resolveValue(
        fieldDefinition as AffinityFieldDto,
        fieldUpdates as AffinityFieldValueChangeDto[],
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
