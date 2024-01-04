import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { selectNotesTableViewModel } from '@app/client/notes/feature/notes-table';
import { NoteStoreFacade } from '@app/client/notes/state';
import { ShelfStoreFacade } from '@app/client/shared/shelf';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  NotesListComponent,
  selectNotesListViewModel,
} from './notes-list.component';

describe('RvncNotesFeatureNotesListComponent', () => {
  let component: NotesListComponent;
  let fixture: ComponentFixture<NotesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotesListComponent,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterTestingModule,
      ],
      providers: [
        provideAnimations(),
        NoteStoreFacade,
        ShelfStoreFacade,
        provideMockStore({
          selectors: [
            {
              selector: selectNotesListViewModel,
              value: {},
            },
            {
              selector: selectNotesTableViewModel,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
