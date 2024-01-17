import type { Meta, StoryObj } from '@storybook/angular';
import * as OpportunitiesTableStories from '../opportunities-table/opportunities-table.component.stories';
import { OrganisationsTableComponent } from './organisations-table.component';

const meta: Meta<OrganisationsTableComponent> = {
  component: OrganisationsTableComponent,
  title: 'Organisations / Organisations Table ',
};
export default meta;
type Story = StoryObj<OrganisationsTableComponent>;

export const Primary: Story = {
  args: {
    model: {
      data: [
        {
          id: '1',
          name: 'Organisation 1',
          domains: ['organisation1.com'],
          status: {
            name: 'Outreach',
            color: '#FF0000',
          },
          score: 'A',
          specterRank: 'A',
          domain: 'organisation1.com',
          hq: 'London',
          opportunities: OpportunitiesTableStories.Primary!.args!.rows!,
          shortList: true,
        },
        {
          id: '2',
          name: 'Organisation 2',
          domains: ['organisation1.com'],
          status: {
            name: 'Outreach',
            color: '#FF0000',
          },
          score: 'A',
          specterRank: 'A',
          domain: 'organisation1.com',
          hq: 'London',
          opportunities: OpportunitiesTableStories.Primary!.args!.rows!,
          shortList: false,
        },
        {
          id: '3',
          name: 'Organisation 3',
          domains: ['organisation1.com'],
          status: {
            name: 'Outreach',
            color: '#FF0000',
          },
          score: 'A',
          specterRank: 'A',
          domain: 'organisation1.com',
          hq: 'London',
          opportunities: OpportunitiesTableStories.Primary!.args!.rows!,
          shortList: true,
        },
        {
          id: '4',
          name: 'Organisation 4',
          domains: ['organisation1.com'],
          status: {
            name: 'Outreach',
            color: '#FF0000',
          },
          score: 'A',
          specterRank: 'A',
          domain: 'organisation1.com',
          hq: 'London',
          opportunities: OpportunitiesTableStories.Primary!.args!.rows!,
          shortList: false,
        },
      ],
      isLoading: false,
      total: 15,
      take: 15,
      skip: 15,
      field: 'none',
      dir: 'asc',
    },
  },
};
