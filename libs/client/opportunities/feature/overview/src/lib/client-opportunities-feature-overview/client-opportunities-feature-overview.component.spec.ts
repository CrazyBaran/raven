import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { from } from 'rxjs';
import {
  ClientOpportunitiesFeatureOverviewComponent,
  selectOpportunityOverviewViewModel,
} from './client-opportunities-feature-overview.component';

describe('ClientOpportunitiesFeatureOverviewComponent', () => {
  let component: ClientOpportunitiesFeatureOverviewComponent;
  let fixture: ComponentFixture<ClientOpportunitiesFeatureOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOpportunitiesFeatureOverviewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
        provideMockStore({
          selectors: [
            {
              selector: selectOpportunityOverviewViewModel,
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
