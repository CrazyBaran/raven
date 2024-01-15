import type { Meta, StoryObj } from '@storybook/angular';
import { StatusIndicatorComponent } from './status-indicator.component';

const meta: Meta<StatusIndicatorComponent> = {
  component: StatusIndicatorComponent,
  title: 'StatusIndicatorComponent',
};
export default meta;
type Story = StoryObj<StatusIndicatorComponent>;

export const Primary: Story = {
  args: {
    updatedStateTimeout: 2000,
  },
};
