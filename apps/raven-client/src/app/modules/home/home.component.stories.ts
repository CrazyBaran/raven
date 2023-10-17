import type { Meta, StoryObj } from '@storybook/angular';
import { HomeComponent } from './home.component';

const meta: Meta<HomeComponent> = {
  component: HomeComponent,
  title: 'App / HomeComponent',
};
export default meta;
type Story = StoryObj<HomeComponent>;

export const Primary: Story = {
  args: {},
};
