import type { Meta, StoryObj } from '@storybook/angular';
import { HomePageComponent } from './home-page.component';

const meta: Meta<HomePageComponent> = {
  component: HomePageComponent,
  title: 'App / HomePageComponent',
};
export default meta;
type Story = StoryObj<HomePageComponent>;

export const Primary: Story = {
  args: {},
};
