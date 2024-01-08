import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { selectNotesGridModel } from '@app/client/notes/feature/notes-table';
import { NoteStoreFacade } from '@app/client/notes/state';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NotesListComponent } from './notes-list.component';
import { selectNotesListViewModel } from './notes-list.selectors';

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
        NoteStoreFacade,
        provideAnimations(),
        provideMockStore({
          selectors: [
            {
              selector: selectNotesListViewModel,
              value: {},
            },
            {
              selector: selectNotesGridModel,
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
