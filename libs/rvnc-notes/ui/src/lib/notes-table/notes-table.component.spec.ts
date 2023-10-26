import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { NotesTableComponent } from './notes-table.component';

describe('NotesTableComponent', () => {
  let component: NotesTableComponent;
  let fixture: ComponentFixture<NotesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesTableComponent],
      providers: [NoteStoreFacade, provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
