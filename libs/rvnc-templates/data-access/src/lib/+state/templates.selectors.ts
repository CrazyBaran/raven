import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TEMPLATES_FEATURE_KEY,
  TemplatesState,
  templatesAdapter,
} from './templates.reducer';

// Lookup the 'Templates' feature state managed by NgRx
export const selectTemplatesState = createFeatureSelector<TemplatesState>(
  TEMPLATES_FEATURE_KEY,
);

const { selectAll, selectEntities } = templatesAdapter.getSelectors();

export const selectTemplatesLoaded = createSelector(
  selectTemplatesState,
  (state: TemplatesState) => state.loaded,
);

export const selectTemplatesError = createSelector(
  selectTemplatesState,
  (state: TemplatesState) => state.error,
);

export const selectAllTemplates = createSelector(
  selectTemplatesState,
  (state: TemplatesState) => selectAll(state),
);

export const selectTemplatesEntities = createSelector(
  selectTemplatesState,
  (state: TemplatesState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectTemplatesState,
  (state: TemplatesState) => state.selectedId,
);

export const selectEntity = createSelector(
  selectTemplatesEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectTemplate = (id: string) =>
  createSelector(selectTemplatesEntities, (entities) =>
    id ? entities[id] : undefined,
  );

export const selectDefaultTemplate = createSelector(
  selectAllTemplates,
  (templates) => {
    const defaultTemplate =
      templates.find((template) => template.name === 'Loose Note') ||
      templates?.[0]; //TODO: template.isDefault,
    return (
      (defaultTemplate && {
        ...defaultTemplate,
        fieldGroups: defaultTemplate.fieldGroups.map((fg) => ({
          ...fg,
          fieldDefinitions: fg.fieldDefinitions.map((field) => ({
            ...field,
            grow: field.type === 'richText', // Set flex grow for rich editor
          })),
        })),
      }) || {
        name: 'Choose Template',
        id: '',
        fieldGroups: [],
      }
    );
  },
);

export const TemplateSelectors = {
  selectTemplatesState,
  selectTemplatesLoaded,
  selectTemplatesError,
  selectAllTemplates,
  selectTemplatesEntities,
  selectSelectedId,
  selectEntity,
  selectTemplate,
  selectDefaultTemplate,
};
