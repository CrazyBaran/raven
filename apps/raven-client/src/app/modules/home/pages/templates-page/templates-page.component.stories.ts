import type { Meta, StoryObj } from '@storybook/angular';
import { TemplatesPageComponent } from './templates-page.component';

const meta: Meta<TemplatesPageComponent> = {
  component: TemplatesPageComponent,
  title: 'App / TemplatesPageComponent',
};
export default meta;
type Story = StoryObj<TemplatesPageComponent>;

export const Primary: Story = {
  args: {},
};
