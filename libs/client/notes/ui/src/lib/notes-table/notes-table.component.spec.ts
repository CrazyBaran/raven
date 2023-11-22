/* eslint-disable @nx/enforce-module-boundaries */
//TODO: refactor notes table

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { from } from 'rxjs';
import { NotesTableComponent } from './notes-table.component';

describe('NotesTableComponent', () => {
  let component: NotesTableComponent;
  let fixture: ComponentFixture<NotesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesTableComponent],
      providers: [
        provideAnimations(),
        NoteStoreFacade,

        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
        provideMockStore({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
