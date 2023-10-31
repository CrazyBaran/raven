import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShelfActions } from './shelf.actions';

@Injectable()
export class ShelfStoreFacade {
  public constructor(private store: Store) {}

  public openNotepad(): void {
    this.store.dispatch(ShelfActions.openNotepad());
  }
}