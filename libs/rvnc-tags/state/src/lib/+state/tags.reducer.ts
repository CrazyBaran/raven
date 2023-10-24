import { TagData } from '@app/rvns-tags';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as _ from 'lodash';

import { TagsActions } from './tags.actions';
import { TagEntity } from './tags.model';

export interface TagsState extends EntityState<TagEntity> {
  selectedId: string | number | null;
  loaded: boolean;
  error: string | null;
}

export const tagAdapter: EntityAdapter<TagEntity> =
  createEntityAdapter<TagEntity>();

export const initialTagState: TagsState = tagAdapter.getInitialState({
  loaded: false,
  error: null,
  selectedId: null,
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
      tagAdapter.setAll([...data], { ...state, loaded: true }),
    ),
    on(TagsActions.getTagsFailure, (state, { error }) => ({
      ...state,
      error,
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

      return [
        ...companyTags,
        ..._.chain(companyTags)
          .map((companyTag) => [
            {
              id: companyTag?.id + '_company',
              name: companyTag?.name,
              label: '(No linked opportunity)',
              type: companyTag?.type,
              companyId: companyTag?.id,
            },
            ...oportunityTags.map((oportunityTag) => ({
              ...oportunityTag,
              companyId: companyTag?.id,
            })),
          ])
          .flatMap()
          .value(),
        ...otherTags,
      ];
    }),
    selectPeopleTags: createSelector(
      selectTagsState,
      (state) =>
        _.values(state.entities).filter(
          (tag) => tag && tag?.type === 'people',
        ) as TagData[],
    ),
  }),
});
