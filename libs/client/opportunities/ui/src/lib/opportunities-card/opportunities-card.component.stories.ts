import type { Meta, StoryObj } from '@storybook/angular';
import { OpportunitiesCardComponent } from './opportunities-card.component';

const meta: Meta<OpportunitiesCardComponent> = {
  component: OpportunitiesCardComponent,
  title: 'OpportunitiesCardComponent',
};
export default meta;
type Story = StoryObj<OpportunitiesCardComponent>;

export const Primary: Story = {
  args: {},
};
