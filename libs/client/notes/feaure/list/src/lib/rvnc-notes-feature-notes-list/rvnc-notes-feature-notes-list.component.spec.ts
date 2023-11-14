import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { authQuery } from '@app/client/core/auth';
import { NoteStoreFacade, notesQuery } from '@app/client/notes/data-access';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RvncNotesFeatureNotesListComponent } from './rvnc-notes-feature-notes-list.component';

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
        NoteStoreFacade,
        provideMockStore({
          selectors: [
            {
              selector: notesQuery.selectAllNotes,
              value: [],
            },
            {
              selector: authQuery.selectUserData,
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
