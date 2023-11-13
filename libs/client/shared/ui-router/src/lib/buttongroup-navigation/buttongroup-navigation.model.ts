export type ButtongroupNavigationModel = {
  filters: {
    id: string | null;
    name: string;
    selected: boolean;
  }[];
  paramName: string;
  queryParamsHandling?: 'merge' | 'preserve';
};
