import {
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { storageFeature } from './lib/+state/storage.reducer';

export * from './lib/+state/storage.actions';
export * from './lib/+state/storage.selectors';
export * from './lib/image-path-dictionary.service';
export * from './lib/storage.service';
export * from './lib/upload-file.service';

export const provideStorageFeature: Array<Provider | EnvironmentProviders> = [
  importProvidersFrom(StoreModule.forFeature(storageFeature)),
];
