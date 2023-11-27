import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { selectNotesTableViewModel } from '@app/client/notes/feature/notes-table';
import { ShelfStoreFacade } from '@app/client/shared/shelf';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  RvncNotesFeatureNotesListComponent,
  selectNotesListViewModel,
} from './rvnc-notes-feature-notes-list.component';

describe('RvncNotesFeatureNotesListComponent', () => {
  let component: RvncNotesFeatureNotesListComponent;
  let fixture: ComponentFixture<RvncNotesFeatureNotesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RvncNotesFeatureNotesListComponent,
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

    fixture = TestBed.createComponent(RvncNotesFeatureNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
