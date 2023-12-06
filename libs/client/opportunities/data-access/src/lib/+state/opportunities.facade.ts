//note store facade service for select and dispatch
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class OpportunitiesFacade {
  public constructor(private store: Store) {}
}
