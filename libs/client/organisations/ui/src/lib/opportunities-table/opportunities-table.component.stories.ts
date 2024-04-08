/* eslint-disable @typescript-eslint/no-explicit-any */
import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { OpportunitiesTableComponent } from './opportunities-table.component';

const meta: Meta<OpportunitiesTableComponent> = {
  component: OpportunitiesTableComponent,
  title: 'Organisations / Organisations Table / Opportunities Table',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style=" height: 700px">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<OpportunitiesTableComponent>;

export const Primary: Story = {
  args: {
    rows: [
      {
        id: '1',
        name: 'Opportunity 1',
        status: {
          name: 'Outreach',
          color: '#FF0000',
        },
        dealLeads: ['John Doe'],
        dealTeam: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-01-01',
      },
      {
        id: '2',
        name: 'Opportunity 2',
        status: {
          name: 'Preliminary DD',
          color: '#831243',
        },
        dealLeads: ['John Doe'],
        dealTeam: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-01-01',
      },
      {
        id: '3',
        name: 'Opportunity 3',
        status: {
          name: 'Open',
          color: '#669966',
        },
        dealLeads: ['John Doe'],
        dealTeam: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-01-01',
      },
      {
        id: '4',
        name: 'Opportunity 4',
        status: {
          name: 'Passed',
          color: '#696969',
        },
        dealLeads: ['John Doe'],
        dealTeam: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-01-01',
      },
      {
        id: '5',
        name: 'Opportunity 5',
        status: {
          name: 'Live Opportunity',
          color: '#213769',
        },
        dealLeads: ['John Doe'],
        dealTeam: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-01-01',
      },
      {
        id: '6',
        name: 'Opportunity 6',
        status: {
          name: 'Portfolio',
          color: '#420332',
        },
        dealLeads: ['John Doe'],
        dealTeam: ['John Doe', 'Jane Doe'],
        updatedAt: '2021-01-01',
      },
    ] as any,
  },
};
