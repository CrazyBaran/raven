import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OpportunityDetailsComponent } from './opportunity-details.component';

describe('OpportunityDetailsComponent', () => {
  let component: OpportunityDetailsComponent;
  let fixture: ComponentFixture<OpportunityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityDetailsComponent, RouterTestingModule],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
