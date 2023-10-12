export interface UiNavAsideRoute {
  path: string;
  name: string;
  icon: string;
  disabled?: boolean;
  subRoutes?: UiNavAsideSubRoute[];
  exact?: boolean;
}

export interface UiNavAsideSubRoute extends Omit<UiNavAsideRoute, 'subRoutes'> {
  value?: string | number;
}
