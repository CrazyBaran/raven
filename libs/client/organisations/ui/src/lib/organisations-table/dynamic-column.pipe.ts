import { Pipe, PipeTransform } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ComponentTemplate } from '@app/client/shared/dynamic-renderer/data-access';
import * as _ from 'lodash';
import {
  OrganisationRowV2,
  TableColumn,
} from './organisations-table.component';

@Pipe({
  name: 'dynamicColumn',
  standalone: true,
})
export class DynamicColumnPipe implements PipeTransform {
  public transform(
    column: TableColumn,
    row: OrganisationRowV2,
  ): ComponentTemplate {
    return {
      name: column.field,
      load: column.componentPath,
      componentData: {
        field: column.dataFn
          ? column.dataFn(row)
          : _.get(row.data, column.field),
      },
    };
  }
}
