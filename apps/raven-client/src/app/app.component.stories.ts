import type { Meta, StoryObj } from '@storybook/angular';
import { AppComponent } from './app.component';

const meta: Meta<AppComponent> = {
  component: AppComponent,
  title: 'App / AppComponent',
};
export default meta;
type Story = StoryObj<AppComponent>;

export const Primary: Story = {
  args: {},
};
