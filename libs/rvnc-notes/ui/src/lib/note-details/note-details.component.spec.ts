import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { NoteDetailsComponent } from './note-details.component';

describe('NoteDetailsComponent', () => {
  let component: NoteDetailsComponent;
  let fixture: ComponentFixture<NoteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteDetailsComponent],
      providers: [NoteStoreFacade, provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
