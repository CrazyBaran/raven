import type { Meta, StoryObj } from '@storybook/angular';
import { BadGatewayPageComponent } from './bad-gateway-page.component';

const meta: Meta<BadGatewayPageComponent> = {
  component: BadGatewayPageComponent,
  title: 'App / BadGatewayPageComponent',
};
export default meta;
type Story = StoryObj<BadGatewayPageComponent>;

export const Primary: Story = {
  args: {},
};
