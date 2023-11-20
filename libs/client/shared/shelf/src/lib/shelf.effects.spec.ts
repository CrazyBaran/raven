import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { provideMockStore } from '@ngrx/store/testing';
import { DialogsModule, WindowModule } from '@progress/kendo-angular-dialog';
import { RavenShelfService } from './raven-shelf.service';
import { ShelfEffects } from './shelf.effects';

describe('ShelfEffects', () => {
  let actions$: Observable<unknown>;
  let effects: ShelfEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WindowModule, DialogsModule],
      providers: [
        ShelfEffects,
        RavenShelfService,
        provideMockActions(() => actions$),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ShelfEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
