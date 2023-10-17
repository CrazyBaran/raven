import type { Meta, StoryObj } from '@storybook/angular';
import { PipelinesPageComponent } from './pipelines-page.component';

const meta: Meta<PipelinesPageComponent> = {
  component: PipelinesPageComponent,
  title: 'App / PipelinesPageComponent',
};
export default meta;
type Story = StoryObj<PipelinesPageComponent>;

export const Primary: Story = {
  args: {},
};
