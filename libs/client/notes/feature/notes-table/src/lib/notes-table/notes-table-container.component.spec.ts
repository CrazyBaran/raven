import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import {
  NotesTableContainerComponent,
  selectNotesTableParams,
  selectNotesTableViewModel,
} from './notes-table-container.component';

describe('ClientNotesFeatureNotesTableComponent', () => {
  let component: NotesTableContainerComponent;
  let fixture: ComponentFixture<NotesTableContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesTableContainerComponent],
      providers: [
        NoteStoreFacade,
        provideMockStore({
          selectors: [
            {
              selector: selectNotesTableViewModel,
              value: {},
            },
            {
              selector: selectNotesTableParams,
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
