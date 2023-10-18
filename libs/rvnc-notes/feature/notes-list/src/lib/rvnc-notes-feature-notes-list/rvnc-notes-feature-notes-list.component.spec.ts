import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RvncNotesFeatureNotesListComponent } from './rvnc-notes-feature-notes-list.component';

describe('RvncNotesFeatureNotesListComponent', () => {
  let component: RvncNotesFeatureNotesListComponent;
  let fixture: ComponentFixture<RvncNotesFeatureNotesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvncNotesFeatureNotesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvncNotesFeatureNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
