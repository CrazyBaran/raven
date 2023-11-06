import type { Meta, StoryObj } from '@storybook/angular';
import { OpportunityDetailsComponent } from './opportunity-details.component';

const meta: Meta<OpportunityDetailsComponent> = {
  component: OpportunityDetailsComponent,
  title: 'OpportunityDetailsComponent',
};
export default meta;
type Story = StoryObj<OpportunityDetailsComponent>;

export const Primary: Story = {
  args: {},
};
