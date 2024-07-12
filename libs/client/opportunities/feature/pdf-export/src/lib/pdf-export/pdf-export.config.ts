import { PDFExportConfiguration, PDFGeneralConfig } from './pdf-export.types';

export const pdfFieldsConfig: PDFExportConfiguration = {
  title: {
    label: '',
    value: {
      value: '{{value}} Team Briefing Materials',
      replacementValue: 'organisation.name',
    },
  },
  headerSection: [
    {
      label: 'Company',
      items: [
        {
          label: 'Name',
          value: {
            value: '{{value}}',
            replacementValue: 'organisation.name',
          },
        },
        {
          label: 'Domain URL',
          value: {
            value: '{{value}}',
            replacementValue: 'organisation.domain',
          },
          type: 'url',
        },
      ],
    },
    {
      label: 'Deal Team',
      items: [
        {
          label: 'Deal lead',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.dealLeads',
          },
          type: 'array',
        },
        {
          label: 'Deal team',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.dealTeam',
          },
          type: 'array',
        },
      ],
    },
    {
      label: 'Financing',
      items: [
        {
          label: 'Opportunity',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.name',
          },
        },
        {
          label: 'Opportunity description',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.description',
          },
        },
        {
          label: 'Instrument',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.tag.name',
          },
        },
        {
          label: 'Instrument size',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.roundSize',
          },
        },
        {
          label: 'Valuation',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.valuation',
          },
        },
        {
          label: 'Proposed investment',
          value: {
            value: '{{value}}',
            replacementValue: 'opportunity.proposedInvestment',
          },
        },
      ],
    },
  ],
};

export const PDFPageConfig: PDFGeneralConfig = {
  paperSize: 'A4',
  margin: '2cm',
  scale: 1,
};
