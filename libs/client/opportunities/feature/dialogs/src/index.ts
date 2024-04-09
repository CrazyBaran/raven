import { DialogConfigs } from '@app/client/shared/util';

export * from './lib/create-opportunity-on-stage-dialog/create-opportunity-on-stage-dialog.component';

export const OPPORTUNITY_DYNAMIC_DIALOGS: DialogConfigs = {
  'reopen-opportunity': () =>
    import('./lib/reopen-opportunity-dialog/providers').then(
      (m) => m.ReopenOpportunityDialogModule,
    ),
  'update-opportunity': () =>
    import('./lib/update-opportunity-dialog/providers').then(
      (m) => m.CreateOpportunityDialogModule,
    ),
  'create-opportunity': () =>
    import('./lib/create-opportunity-dialog/providers').then(
      (m) => m.CreateOpportunityDialogModule,
    ),
};
