import { ButtonSize } from '@progress/kendo-angular-buttons';

export type ButtongroupNavigationModel = {
  filters: {
    id: string | null;
    name: string;
    selected: boolean;
  }[];
  paramName: string;
  queryParamsHandling?: 'merge' | 'preserve';
  size?: ButtonSize;
};
