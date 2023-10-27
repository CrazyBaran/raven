import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { CreateTagData } from '@app/rvnc-tags/data-access';
import { TagsActions } from './tags.actions';
import { tagsFeature } from './tags.reducer';

@Injectable({
  providedIn: 'root',
})
export class TagsStoreFacade {
  public loaded$ = this.store.select(tagsFeature.selectLoaded);
  public loaded = this.store.selectSignal(tagsFeature.selectLoaded);

  public allTags$ = this.store.select(tagsFeature.selectAll);

  public allTagsWithCompanyRelation = this.store.selectSignal(
    tagsFeature.selectTagsWithCompanyRelation,
  );

  public peopleTags = this.store.selectSignal(tagsFeature.selectPeopleTags);

  public constructor(private store: Store) {}

  public init(): void {
    this.store.dispatch(TagsActions.getTags());
  }

  public createTag(data: CreateTagData): void {
    this.store.dispatch(TagsActions.createTag({ data }));
  }
}
