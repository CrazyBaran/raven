import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportunityDetailsPageComponent } from './opportunity-details-page.component';

describe('OpportunityDetailsPageComponent', () => {
  let component: OpportunityDetailsPageComponent;
  let fixture: ComponentFixture<OpportunityDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityDetailsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
