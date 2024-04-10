// eslint-disable-next-line @nx/enforce-module-boundaries
import { ComponentTemplate } from '@app/client/shared/dynamic-renderer/data-access';
import { DialogSettings } from '@progress/kendo-angular-dialog';

export class DialogUtil {
  public static queryParams = {
    reopenOpportunity: 'reopen-opportunity' as const,
    updateOpportunityStage: 'update-opportunity-stage' as const,
    updateOrganisationDescription: 'update-organisation-description' as const,
    passCompany: 'pass-company' as const,
    moveToOutreachCompany: 'move-to-outreach-company' as const,

    updateShortlist: 'update-shortlist' as const,
    createShortlist: 'create-shortlist' as const,
    deleteShortlist: 'delete-shortlist' as const,
    addToShortlist: 'add-to-shortlist' as const,
    removeFromShortlist: 'remove-from-shortlist' as const,
    removeShortlistFromOrganisation:
      'remove-shortlist-from-organisation' as const,

    updateReminder: 'update-reminder' as const,
    createReminder: 'create-reminder' as const,
    deleteReminder: 'delete-reminder' as const,
    completeReminder: 'complete-reminder' as const,
    reminderDetails: 'reminder-details' as const,

    createOpportunity: 'create-opportunity' as const,
    updateOpportunity: 'update-opportunity' as const,
    editFinancial: 'edit-financial-kpi' as const,
  };
}

export type DynamicDialogParam =
  (typeof DialogUtil.queryParams)[keyof typeof DialogUtil.queryParams];

export type DialogConfigs = Partial<
  Record<
    DynamicDialogParam,
    | {
        settings?: Omit<DialogSettings, 'content'>;
        template: Omit<ComponentTemplate, 'name'>;
      }
    | ComponentTemplate['load']
  >
>;
