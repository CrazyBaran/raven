import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteStoreFacadeService } from '@app/rvnc-notes/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { RvncNotesFeatureNotesListComponent } from './rvnc-notes-feature-notes-list.component';

describe('RvncNotesFeatureNotesListComponent', () => {
  let component: RvncNotesFeatureNotesListComponent;
  let fixture: ComponentFixture<RvncNotesFeatureNotesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvncNotesFeatureNotesListComponent],
      providers: [NoteStoreFacadeService, provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(RvncNotesFeatureNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
