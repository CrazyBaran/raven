import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { notesQuery } from '@app/client/notes/data-access';
import { opportunitiesQuery } from '@app/client/opportunities/data-access';
import { OrganisationsFeature } from '@app/client/organisations/state';
import { TagComponent, UserTagDirective } from '@app/client/shared/ui';
import { getRouterSelectors } from '@ngrx/router-store';
import { Store, createSelector } from '@ngrx/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { TileLayoutModule } from '@progress/kendo-angular-layout';
import { RxFor } from '@rx-angular/template/for';
import * as _ from 'lodash';

export const selectNoteFields = createSelector(
  notesQuery.selectOpportunityNotes,
  (notes) =>
    _.chain(notes[0]?.noteTabs ?? [])

      .map((tab) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tab.noteFieldGroups[0].noteFields.map((field: any) => ({
          id: field.id,
          title: field.name,
          value: field.value,
          tabId: tab.id,
          tabName: tab.name,
        })),
      )
      .flatMap()
      .value(),
);

export const selectOpportunityOverviewViewModel = createSelector(
  getRouterSelectors().selectQueryParams,
  opportunitiesQuery.selectRouteOpportunityDetails,
  OrganisationsFeature.selectCurrentOrganisation,
  selectNoteFields,
  (params, opportunity, organisation, noteFields) => {
    return {
      details: [
        {
          label: organisation?.name,
          subLabel: organisation?.domains[0],
        },
        {
          label: opportunity?.tag?.name,
          subLabel: 'Opportunity',
        },
        {
          label: opportunity?.roundSize,
          subLabel: 'Round Size',
        },
        {
          label: opportunity?.valuation,
          subLabel: 'Valuation',
        },
        {
          label: opportunity?.proposedInvestment,
          subLabel: 'Proposed Investment',
        },
        {
          label: opportunity?.positioning
            ? _.startCase(_.toLower(opportunity.positioning))
            : null,
          subLabel: 'Positioning',
        },
        {
          label: opportunity?.timing,
          subLabel: 'Timing',
        },
        {
          label: opportunity?.underNda
            ? _.startCase(_.toLower(opportunity.positioning))
            : null,
          subLabel: 'Under NDA',
        },
        {
          label:
            opportunity?.ndaTerminationDate &&
            _.isDate(new Date(opportunity.ndaTerminationDate))
              ? new Date(opportunity.ndaTerminationDate).toLocaleDateString(
                  'en-GB',
                )
              : null,
          subLabel: 'NDA Termination Date',
        },
      ].filter(({ label }) => !!label),
      hasTeam:
        !!opportunity?.dealTeam?.length || !!opportunity?.dealLeads?.length,
      team: [
        {
          dealLead: {
            name: opportunity?.dealLeads[0],
          },
          dealTeam: opportunity?.dealTeam.map((name) => ({
            name,
          })),
        },
      ],
      id: opportunity?.id,
      missingDetails: noteFields
        .filter(({ value }) => !value?.trim())
        .map(({ tabName, title }) => ({
          tab: tabName,
          field: title,
          action: 'Please fill field to advance',
        })),
    };
  },
);

@Component({
  selector: 'app-client-opportunities-feature-overview',
  standalone: true,
  imports: [
    CommonModule,
    TileLayoutModule,
    ButtonModule,
    RxFor,
    GridModule,
    TagComponent,
    UserTagDirective,
    RouterLink,
  ],
  templateUrl: './client-opportunities-feature-overview.component.html',
  styleUrls: ['./client-opportunities-feature-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesFeatureOverviewComponent {
  protected store = inject(Store);

  protected vm = this.store.selectSignal(selectOpportunityOverviewViewModel);
}
