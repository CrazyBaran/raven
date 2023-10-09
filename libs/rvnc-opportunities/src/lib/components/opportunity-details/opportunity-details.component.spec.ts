import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportunityDetailsComponent } from './opportunity-details.component';

describe('OpportunityDetailsComponent', () => {
  let component: OpportunityDetailsComponent;
  let fixture: ComponentFixture<OpportunityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
