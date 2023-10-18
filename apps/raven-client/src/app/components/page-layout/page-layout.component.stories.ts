import type { Meta, StoryObj } from '@storybook/angular';
import { PageLayoutComponent } from './page-layout.component';

const meta: Meta<PageLayoutComponent> = {
  component: PageLayoutComponent,
  title: 'App / PageLayoutComponent',
};
export default meta;
type Story = StoryObj<PageLayoutComponent>;

export const Primary: Story = {
  args: {},
};
