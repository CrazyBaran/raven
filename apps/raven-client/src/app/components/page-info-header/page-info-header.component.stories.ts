import type { Meta, StoryObj } from '@storybook/angular';
import { PageInfoHeaderComponent } from './page-info-header.component';

const meta: Meta<PageInfoHeaderComponent> = {
  component: PageInfoHeaderComponent,
  title: 'App / PageInfoHeaderComponent',
};
export default meta;
type Story = StoryObj<PageInfoHeaderComponent>;

export const Primary: Story = {
  args: {},
};
