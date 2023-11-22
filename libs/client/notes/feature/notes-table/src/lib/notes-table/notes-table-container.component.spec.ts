import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { from } from 'rxjs';
import { NotesTableContainerComponent } from './notes-table-container.component';
import { selectNotesTableViewModel } from './notes-table-container.selectors';

describe('ClientNotesFeatureNotesTableComponent', () => {
  let component: NotesTableContainerComponent;
  let fixture: ComponentFixture<NotesTableContainerComponent>;

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
