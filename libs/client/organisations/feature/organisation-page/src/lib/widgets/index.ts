import { OrganisationDetailsComponent } from './organisation-details/organisation-details.component';
import { OrganisationFilesComponent } from './organisation-files/organisation-files.component';
import { OrganisationNotesComponent } from './organisation-notes/organisation-notes.component';
import { OrganisationOpportunitiesComponent } from './organisation-opportunities/organisation-opportunities.component';
import { OrganisationRemindersTableComponent } from './organisation-reminders-table/organisation-reminders-table.component';
import { OrganisationShortlistsTableComponent } from './organisation-shortlists-table/organisation-shortlists-table.component';

export const ORGANISATION_WIDGETS = [
  OrganisationShortlistsTableComponent,
  OrganisationRemindersTableComponent,
  OrganisationNotesComponent,
  OrganisationOpportunitiesComponent,
  OrganisationFilesComponent,
  OrganisationDetailsComponent,
];
