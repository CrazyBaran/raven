/* eslint-disable @typescript-eslint/no-explicit-any */
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
          opportunities: OpportunitiesTableStories.Primary!.args!.rows!,
          data: {
            score: 'A',
            hq: {
              localization: 'London',
            },
            industry: {
              industries: ['Tech', 'Finance'],
            },
          },
        },
      ],
      isLoading: false,
      total: 15,
      take: 15,
      skip: 15,
      field: 'none',
      dir: 'asc',
    } as any,
    filters: {
      Country: ['United Kingdom', 'Poland'],
      City: ['London', 'Warsaw'],
      Status: ['Met'],
    } as any,
  },
};
