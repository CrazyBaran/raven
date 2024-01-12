import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { OpportunitiesCardComponent } from './opportunities-card.component';

const meta: Meta<OpportunitiesCardComponent> = {
  component: OpportunitiesCardComponent,
  title: 'Opportunities UI / Kanban Board  / Opportunities Card ',
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div style=" width: 380px; padding:30px; background:ghostwhite">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<OpportunitiesCardComponent>;

export const Primary: Story = {
  args: {
    model: {
      id: '1',
      organisation: {
        id: '1',
        name: 'Organisation name',
        domains: ['domain.pl'],
      },
      createdAt: '2021-07-01T12:00:00.000Z',
    },
  },
};

export const WithDealLeads: Story = {
  args: {
    model: {
      ...Primary.args!.model!,
      id: '2',
      dealLeads: ['Virgile Audi'],
    },
  },
};

export const WithAllFields: Story = {
  args: {
    model: {
      ...WithDealLeads.args!.model!,
      id: '3',
      affinityUrl: 'https://www.google.com',
      name: 'Series A',
      dealSize: '$15m',
      timing: 'Q2 - 2024',
    },
  },
};
