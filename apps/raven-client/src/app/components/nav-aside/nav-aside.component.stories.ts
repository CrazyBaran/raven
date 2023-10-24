import type { Meta, StoryObj } from '@storybook/angular';
import { NavAsideComponent } from './nav-aside.component';

const meta: Meta<NavAsideComponent> = {
  component: NavAsideComponent,
  title: 'App / NavAsideComponent',
};
export default meta;
type Story = StoryObj<NavAsideComponent>;

export const Primary: Story = {
  args: {},
};
