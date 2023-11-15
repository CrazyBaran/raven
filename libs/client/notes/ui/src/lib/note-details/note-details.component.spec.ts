/* eslint-disable @nx/enforce-module-boundaries */
//TODO: refactor notes table

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { NoteDetailsComponent } from './note-details.component';

describe('NoteDetailsComponent', () => {
  let component: NoteDetailsComponent;
  let fixture: ComponentFixture<NoteDetailsComponent>;
  let actions$: Observable<unknown>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteDetailsComponent],
      providers: [
        NoteStoreFacade,
        provideMockActions(() => actions$),
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
