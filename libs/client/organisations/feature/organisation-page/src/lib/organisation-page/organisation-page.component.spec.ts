/* eslint-disable @nx/enforce-module-boundaries */
//TODO: Refactor opportunity details

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { selectNotesTableViewModel } from '@app/client/notes/feature/notes-table';
import { OpportunitiesFacade } from '@app/client/opportunities/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { OrganisationPageComponent } from './organisation-page.component';
import { selectOrganisationPageViewModel } from './organisation-page.selectors';

describe('OrganisationPageComponent', () => {
  let component: OrganisationPageComponent;
  let fixture: ComponentFixture<OrganisationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationPageComponent, RouterTestingModule],
      providers: [
        provideAnimations(),
        provideMockStore({
          selectors: [
            {
              selector: selectOrganisationPageViewModel,
              value: {
                opportunityId: '1',
                currentOrganisationId: '1',
              },
            },
            {
              selector: selectNotesTableViewModel,
              value: {},
            },
          ],
        }),
        OpportunitiesFacade,
        NoteStoreFacade,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
