import type { Meta, StoryObj } from '@storybook/angular';
import { AffinityUrlButtonComponent } from './affinity-url-button.component';

const meta: Meta<AffinityUrlButtonComponent> = {
  component: AffinityUrlButtonComponent,
  title: 'AffinityUrlButtonComponent',
};
export default meta;
type Story = StoryObj<AffinityUrlButtonComponent>;

export const Primary: Story = {
  args: {
    url: '',
    vertical: false,
  },
};
