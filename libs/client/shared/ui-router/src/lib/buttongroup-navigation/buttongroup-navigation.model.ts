import { ButtonSize } from '@progress/kendo-angular-buttons';

export type ButtongroupNavigationModel = {
  filters: {
    id: string | null | undefined;
    name: string;
    selected: boolean;
    queryParams: Record<string, string | null>;
    iconClass?: string;
  }[];
  // paramName: string;
  queryParamsHandling?: 'merge' | 'preserve';
  size?: ButtonSize;
  toggleable?: boolean;
};
