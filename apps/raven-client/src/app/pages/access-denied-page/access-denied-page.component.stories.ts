import type { Meta, StoryObj } from '@storybook/angular';
import { AccessDeniedPageComponent } from './access-denied-page.component';

const meta: Meta<AccessDeniedPageComponent> = {
  component: AccessDeniedPageComponent,
  title: 'App / AccessDeniedPageComponent',
};
export default meta;
type Story = StoryObj<AccessDeniedPageComponent>;

export const Primary: Story = {
  args: {},
};
