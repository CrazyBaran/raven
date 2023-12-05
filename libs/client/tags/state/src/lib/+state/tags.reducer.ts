import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as _ from 'lodash';

import { TagsActions } from './tags.actions';
import { TagEntity } from './tags.model';

export interface TagsState extends EntityState<TagEntity> {
  selectedId: string | number | null;
  loaded: boolean;
  error: string | null;
  loadedTags: Partial<Record<TagEntity['type'], boolean>>;
  loadingTags: Partial<Record<TagEntity['type'], boolean>>;
}

export const tagAdapter: EntityAdapter<TagEntity> =
  createEntityAdapter<TagEntity>();

export const initialTagState: TagsState = tagAdapter.getInitialState({
  loaded: false,
  error: null,
  selectedId: null,
  loadedTags: {},
  loadingTags: {},
});
export const tagsFeature = createFeature({
  name: 'tags',
  reducer: createReducer(
    initialTagState,
    on(TagsActions.getTags, (state) => ({
      ...state,
      loaded: false,
      error: null,
    })),
    on(TagsActions.getTagsSuccess, (state, { data }) =>
      tagAdapter.upsertMany([...data], { ...state, loaded: true }),
    ),
    on(TagsActions.getTagsFailure, (state, { error }) => ({
      ...state,
      error,
    })),

    on(TagsActions.getTagsByTypes, (state, { tagTypes }) => ({
      ...state,
      loadingTags: {
        ...state.loadingTags,
        ..._.chain(tagTypes)
          .keyBy((x) => x)
          .mapValues(() => true)
          .value(),
      },
      loadedTags: {
        ...state.loadedTags,
        ..._.chain(tagTypes)
          .keyBy((x) => x)
          .mapValues(() => true)
          .value(),
      },
    })),
    on(TagsActions.getTagsByTypesSuccess, (state, { data, tagTypes }) =>
      tagAdapter.upsertMany([...data], {
        ...state,
        loadingTags: {
          ...state.loadingTags,
          ..._.chain(tagTypes)
            .keyBy((x) => x)
            .mapValues(() => false)
            .value(),
        },
      }),
    ),
    on(TagsActions.getTagsByTypesFailure, (state, { error, tagTypes }) => ({
      ...state,
      loadingTags: {
        ...state.loadingTags,
        ..._.chain(tagTypes)
          .keyBy((x) => x)
          .mapValues(() => false)
          .value(),
      },
    })),

    on(TagsActions.createTagSuccess, (state, { data }) =>
      tagAdapter.addOne(data, { ...state, loaded: true }),
    ),
  ),
  extraSelectors: ({ selectTagsState }) => ({
    ...tagAdapter.getSelectors(selectTagsState),
    selectTagsWithCompanyRelation: createSelector(selectTagsState, (state) => {
      const tags = _.values(state.entities);
      const companyTags = tags.filter((tag) => tag?.type === 'company');
      const oportunityTags = tags.filter((tag) => tag?.type === 'opportunity');
      const otherTags = tags.filter(
        (tag) => tag?.type !== 'company' && tag?.type !== 'opportunity',
      );

      return [...companyTags, ...oportunityTags, ...otherTags];
    }),
    selectPeopleTags: createSelector(selectTagsState, (state) =>
      selectTagsByTypes(state, 'people'),
    ),
    selectOpportunityTags: createSelector(selectTagsState, (state) =>
      selectTagsByTypes(state, 'opportunity'),
    ),
    selectOrganisationTags: createSelector(selectTagsState, (state) =>
      selectTagsByTypes(state, 'company'),
    ),
    selectTabTags: createSelector(selectTagsState, (state) =>
      selectTagsByTypes(state, 'tab'),
    ),
  }),
});

const selectTagsByTypes = (
  state: TagsState,
  type: TagEntity['type'],
): TagEntity[] =>
  _.values(state.entities).filter(
    (tag) => tag && tag?.type === type,
  ) as TagEntity[];
