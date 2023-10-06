import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RvncOpportunitiesComponent } from './rvnc-opportunities.component';

describe('RvncOpportunitiesComponent', () => {
  let component: RvncOpportunitiesComponent;
  let fixture: ComponentFixture<RvncOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvncOpportunitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvncOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
