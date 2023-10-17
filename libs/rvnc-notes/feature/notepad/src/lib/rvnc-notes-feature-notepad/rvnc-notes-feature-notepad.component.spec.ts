import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RvncNotesFeatureNotepadComponent } from '@app/rvnc-notes/feature/notepad';

describe('RvncNotesFeatureNotepadComponent', () => {
  let component: RvncNotesFeatureNotepadComponent;
  let fixture: ComponentFixture<RvncNotesFeatureNotepadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvncNotesFeatureNotepadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvncNotesFeatureNotepadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
