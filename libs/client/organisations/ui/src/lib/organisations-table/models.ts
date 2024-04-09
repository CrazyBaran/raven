/* eslint-disable @typescript-eslint/no-explicit-any */
import { DropdownAction } from '@app/client/shared/ui-router';
import { OpportunityRow } from '../opportunities-table/opportunities-table.component';

export type TableColumn = {
  componentPath: () => Promise<any>;
  name: string;
  field: string;
  filter: string | null;
  sortable: boolean;
  type?: string;
  dataFn?: (row: OrganisationRowV2) => any;
  width?: number;
};
export type OrganisationRowV2 = {
  id: string;
  name: string;
  domains: string[];
  status: {
    name: string;
    color: string;
  };
  opportunities: OpportunityRow[];
  data: any;
  shortlists?: { name: string; id: string }[];
  actionData?: DropdownAction[];
};
export type OrganisationTableBulkAction = {
  text: string;
  queryParamName: string;
};
