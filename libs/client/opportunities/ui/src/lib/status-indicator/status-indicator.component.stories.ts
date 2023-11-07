import type { Meta, StoryObj } from '@storybook/angular';
import { StatusIndicatorComponent } from './status-indicator.component';

const meta: Meta<StatusIndicatorComponent> = {
  component: StatusIndicatorComponent,
  title: 'Opportunities UI / StatusIndicatorComponent',
  render: (args: StatusIndicatorComponent) => ({
    props: {
      ...args,
    },
    template: `
      <app-status-indicator [theme]="theme" [state]="state">Status</app-status-indicator>
    `,
  }),
};
export default meta;
type Story = StoryObj<StatusIndicatorComponent>;

export const Primary: Story = {
  args: {
    theme: 'blue',
  },
};

export const PrimaryActive: Story = {
  args: {
    theme: 'blue',
    state: 'active',
  },
};

export const Orange: Story = {
  args: {
    theme: 'orange',
  },
};

export const Purple: Story = {
  args: {
    theme: 'purple',
  },
};

export const Yellow: Story = {
  args: {
    theme: 'yellow',
  },
};

export const Red: Story = {
  args: {
    theme: 'red',
  },
};
