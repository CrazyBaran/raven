import { DialogConfigs } from '@app/client/shared/util';

export const OPPORTUNITY_DYNAMIC_DIALOGS: DialogConfigs = {
  'reopen-opportunity': () =>
    import('./lib/reopen-opportunity-dialog/providers').then(
      (m) => m.ReopenOpportunityDialogModule,
    ),
  'update-opportunity': () =>
    import('./lib/update-opportunity-dialog/providers').then(
      (m) => m.CreateOpportunityDialogModule,
    ),
  'update-opportunity-stage': () =>
    import('./lib/update-opportunity-stage-dialog/providers').then(
      (m) => m.UpdateOpportunityStageModule,
    ),
  'create-opportunity': () =>
    import('./lib/create-opportunity-dialog/providers').then(
      (m) => m.CreateOpportunityDialogModule,
    ),
  'edit-financial-kpi': () =>
    import('./lib/edit-financial-kpi-dialog/providers').then(
      (m) => m.EditFinancialKpiDialogModule,
    ),
};

export * from './lib/create-opportunity-on-stage-dialog/create-opportunity-on-stage-dialog.component';
