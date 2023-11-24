//TODO: add model library
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DropdownNavigationModel } from '@app/client/shared/ui-router';

export type BuildDropdownNavigation<T extends Record<string, string>> = {
  params: T;
  name: keyof T;
  data: { id: string | null | undefined; name: string }[];
  loading: boolean | undefined | null;
  defaultItem: { id: string | null; name: string };
};

export function buildDropdownNavigation<T extends Record<string, string>>({
  params,
  name,
  data,
  loading,
  defaultItem,
}: BuildDropdownNavigation<T>): DropdownNavigationModel {
  return {
    queryParamName: name as string,
    data,
    defaultItem: defaultItem,
    value: data.find(({ id }) => id === params[name]),
    loading,
  };
}
