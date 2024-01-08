import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { NoteStoreFacade } from '@app/client/notes/state';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, from } from 'rxjs';
import { NotesTableContainerComponent } from './notes-table-container.component';
import { selectNotesTableViewModel } from './notes-table-container.selectors';

describe('ClientNotesFeatureNotesTableComponent', () => {
  let component: NotesTableContainerComponent;
  let fixture: ComponentFixture<NotesTableContainerComponent>;
  let actions$: Observable<unknown>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesTableContainerComponent],
      providers: [
        NoteStoreFacade,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
        provideMockActions(() => actions$),
        provideAnimations(),
        provideMockStore({
          selectors: [
            {
              selector: selectNotesTableViewModel,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesTableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
