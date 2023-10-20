export interface UiNavAsideRoute {
  name: string;
  icon: string;
  path?: string;
  disabled?: boolean;
  subRoutes?: UiNavAsideSubRoute[];
  exact?: boolean;
  click?: () => void;
}

export interface UiNavAsideSubRoute extends Omit<UiNavAsideRoute, 'subRoutes'> {
  value?: string | number;
}
