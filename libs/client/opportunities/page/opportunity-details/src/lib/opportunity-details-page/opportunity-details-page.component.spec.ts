/* eslint-disable @nx/enforce-module-boundaries */
//TODO: Refactor opportunity details

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { OpportunitiesFacade } from '@app/client/opportunities/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { OpportunityDetailsPageComponent } from './opportunity-details-page.component';
import { selectOpportunityDetailViewModel } from './opportunity-details-page.selectors';

describe('OpportunityDetailsPageComponent', () => {
  let component: OpportunityDetailsPageComponent;
  let fixture: ComponentFixture<OpportunityDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityDetailsPageComponent, RouterTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectOpportunityDetailViewModel,
              value: {
                opportunityId: '1',
                currentOrganisationId: '1',
              },
            },
          ],
        }),
        OpportunitiesFacade,
        NoteStoreFacade,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
