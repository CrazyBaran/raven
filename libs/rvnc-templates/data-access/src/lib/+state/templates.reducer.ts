import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { TemplateWithRelationsData } from '@app/rvns-templates';
import { TemplateActions } from './templates.actions';

export const TEMPLATES_FEATURE_KEY = 'templates';

export interface TemplatesState extends EntityState<TemplateWithRelationsData> {
  selectedId?: string | number; // which Templates record has been selected
  loaded: boolean; // has the Templates list been loaded
  error?: string | null; // last known error (if any)
}

export interface TemplatesPartialState {
  readonly [TEMPLATES_FEATURE_KEY]: TemplatesState;
}

export const templatesAdapter: EntityAdapter<TemplateWithRelationsData> =
  createEntityAdapter<TemplateWithRelationsData>({});

export const initialTemplatesState: TemplatesState =
  templatesAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialTemplatesState,

  on(TemplateActions.getTemplates, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TemplateActions.getTemplatesSuccess, (state, { data }) =>
    templatesAdapter.upsertMany(
      data.map((t) => ({ ...t })),
      { ...state, loaded: true },
    ),
  ),
  on(TemplateActions.getTemplatesFailure, (state, { error }) => ({
    ...state,
    loaded: true,
    error,
  })),

  on(TemplateActions.getTemplate, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(TemplateActions.getTemplateSuccess, (state, { data }) =>
    templatesAdapter.upsertOne(data, { ...state, loaded: true }),
  ),
  on(TemplateActions.getTemplateFailure, (state, { error }) => ({
    ...state,
    loaded: true,
    error,
  })),
);

export function templatesReducer(
  state: TemplatesState | undefined,
  action: Action,
): TemplatesState {
  return reducer(state, action);
}
