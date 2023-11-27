import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { from } from 'rxjs';
import {
  OpportunityFilesComponent,
  selectOpportunityFilesViewModel,
} from './opportunity-files.component';

describe('ClientOpportunitiesFeatureFilesComponent', () => {
  let component: OpportunityFilesComponent;
  let fixture: ComponentFixture<OpportunityFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityFilesComponent],
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
              selector: selectOpportunityFilesViewModel,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
