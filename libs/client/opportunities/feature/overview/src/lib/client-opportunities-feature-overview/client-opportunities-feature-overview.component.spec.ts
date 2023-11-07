import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ClientOpportunitiesFeatureOverviewComponent,
  SelectOpportunityOverviewViewModel,
} from './client-opportunities-feature-overview.component';

describe('ClientOpportunitiesFeatureOverviewComponent', () => {
  let component: ClientOpportunitiesFeatureOverviewComponent;
  let fixture: ComponentFixture<ClientOpportunitiesFeatureOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOpportunitiesFeatureOverviewComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SelectOpportunityOverviewViewModel,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ClientOpportunitiesFeatureOverviewComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
