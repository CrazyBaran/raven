import type { Meta, StoryObj } from '@storybook/angular';
import { UnderConstructionComponent } from './under-construction.component';

const meta: Meta<UnderConstructionComponent> = {
  component: UnderConstructionComponent,
  title: 'App / UnderConstructionComponent',
};
export default meta;
type Story = StoryObj<UnderConstructionComponent>;

export const Primary: Story = {
  args: {},
};
