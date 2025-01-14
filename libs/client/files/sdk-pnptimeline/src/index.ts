import { _Picker } from './picker';

export * from './behaviors/embed-behaviors';
export * from './behaviors/errors';
export * from './behaviors/lamda-authenticate';
export * from './behaviors/log-notifications';
export * from './behaviors/msal-authenticate';
export * from './behaviors/popup-behaviors';
export * from './behaviors/resolves';
export * from './behaviors/setup';
export {
  IAuthenticateCommand,
  IFilePickerOptions,
  IPickData,
  SPItem,
} from './types';

export type PickerInit = [];

export function Picker(window: Window): _Picker {
  if (typeof window === 'undefined') {
    throw Error(
      'You must supply a valid Window for the picker to render within.',
    );
  }

  return new _Picker(window);
}

export type IPicker = ReturnType<typeof Picker>;
