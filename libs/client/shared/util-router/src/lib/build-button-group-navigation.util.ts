//TODO: add model library
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ButtongroupNavigationModel } from '@app/client/shared/ui-router';

export type BuildButtonGroupNavigation<
  T extends Record<string, string | null | undefined>,
> = {
  params: T;
  name: keyof T;
  buttons: {
    id: string | null | undefined;
    name: string;
    iconClass?: string;
  }[];
  toggleable?: boolean;
  staticQueryParams?: Record<string, string | null>;
};

export function buildButtonGroupNavigation<
  T extends Record<string, string | null | undefined>,
>({
  params,
  name,
  buttons,
  toggleable,
  staticQueryParams,
}: BuildButtonGroupNavigation<T>): ButtongroupNavigationModel {
  return {
    filters: buttons.map((b) => ({
      id: b.id,
      name: b.name,
      selected: b.id == params[name],
      queryParams: {
        [name as string]: b.id!,
        ...(staticQueryParams ?? {}),
      },
      iconClass: b.iconClass,
    })),
    toggleable,
  };
}
