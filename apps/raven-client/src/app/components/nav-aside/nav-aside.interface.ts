import { Params } from '@angular/router';

export interface UiNavAsideRoute {
  name: string;
  icon: string;
  path: string;
  disabled?: boolean;
  subRoutes?: UiNavAsideSubRoute[];
  exact?: boolean;
  navigate?: boolean;
  badge?: {
    value: string | number;
  };
  queryParams?: Params;
}

export interface UiNavAsideSubRoute extends Omit<UiNavAsideRoute, 'subRoutes'> {
  value?: string | number;
}
