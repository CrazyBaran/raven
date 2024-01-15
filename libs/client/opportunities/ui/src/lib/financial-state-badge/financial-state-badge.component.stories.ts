import type { Meta, StoryObj } from '@storybook/angular';
import { FinancialStateBadgeComponent } from './financial-state-badge.component';

const meta: Meta<FinancialStateBadgeComponent> = {
  component: FinancialStateBadgeComponent,
  title: 'FinancialStateBadgeComponent',
};
export default meta;
type Story = StoryObj<FinancialStateBadgeComponent>;

export const Primary: Story = {
  args: {},
};
