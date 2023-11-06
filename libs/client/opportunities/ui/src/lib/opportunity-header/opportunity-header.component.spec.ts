import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportunityHeaderComponent } from './opportunity-header.component';

describe('StatusIndicatorComponent', () => {
  let component: OpportunityHeaderComponent;
  let fixture: ComponentFixture<OpportunityHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
