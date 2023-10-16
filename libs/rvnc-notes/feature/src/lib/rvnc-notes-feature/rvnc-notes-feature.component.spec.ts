import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RvncNotesFeatureComponent } from './rvnc-notes-feature.component';

describe('RvncNotesFeatureComponent', () => {
  let component: RvncNotesFeatureComponent;
  let fixture: ComponentFixture<RvncNotesFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvncNotesFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvncNotesFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
