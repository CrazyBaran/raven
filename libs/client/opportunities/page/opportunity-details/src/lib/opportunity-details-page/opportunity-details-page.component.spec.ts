/* eslint-disable @nx/enforce-module-boundaries */
//TODO: Refactor opportunity details

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NoteStoreFacade, selectNotesState } from '@app/client/notes/state';
import { OpportunitiesFacade } from '@app/client/opportunities/data-access';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { storageQuery } from '../../../../../../shared/storage/data-access/src';
import {
  PDFContentComponent,
  PDFExportComponent,
} from '../../../../../feature/pdf-export/src';
import { OpportunityDetailsPageComponent } from './opportunity-details-page.component';
import { selectOpportunityDetailViewModel } from './opportunity-details-page.selectors';

describe('OpportunityDetailsPageComponent', () => {
  let component: OpportunityDetailsPageComponent;
  let fixture: ComponentFixture<OpportunityDetailsPageComponent>;
  let actions$: Observable<unknown>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OpportunityDetailsPageComponent,
        RouterTestingModule,
        PDFExportComponent,
        PDFContentComponent,
      ],
      providers: [
        provideAnimations(),
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectOpportunityDetailViewModel,
              value: {
                opportunityId: '1',
                currentOrganisationId: '1',
                lines: {
                  disabledItem: (): boolean => true,
                },
              },
            },
            {
              selector: selectNotesState,
              value: {
                opportunityId: '1',
                opportunityNotes: [],
              },
            },
            {
              selector: storageQuery.selectAzureImageDictionary,
              value: {
                images: [],
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
