export type BuildInputNavigation<T extends Record<string, string>> = {
  params: T;
  name: keyof T;
  placeholder: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function buildInputNavigation<T extends Record<string, string>>({
  params,
  placeholder,
  name,
}: BuildInputNavigation<T>) {
  return {
    queryParamName: name as string,
    placeholder: placeholder,
    urlValue: params[name] ?? '',
  };
}
