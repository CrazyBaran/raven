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
}

export interface UiNavAsideSubRoute extends Omit<UiNavAsideRoute, 'subRoutes'> {
  value?: string | number;
}
