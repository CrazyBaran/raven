//TODO: add model library
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TextBoxNavigationModel } from '@app/client/shared/ui-router';

export type BuildInputNavigation<T extends Record<string, string | null>> = {
  params: T;
  name: keyof T;
  placeholder: string;
  value?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function buildInputNavigation<T extends Record<string, string | null>>({
  params,
  placeholder,
  name,
}: BuildInputNavigation<T>): TextBoxNavigationModel {
  return {
    queryParamName: name as string,
    placeholder: placeholder,
    urlValue: params[name] ?? '',
  };
}
