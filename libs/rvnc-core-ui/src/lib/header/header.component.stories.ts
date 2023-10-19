import type { Meta, StoryObj } from '@storybook/angular';
import { HeaderComponent } from './header.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<HeaderComponent> = {
  component: HeaderComponent,
  title: 'HeaderComponent',
};
export default meta;
type Story = StoryObj<HeaderComponent>;

export const Primary: Story = {
  args: {
    pageName: '',
    pageIcon: '',
  },
};

export const Heading: Story = {
  args: {
    pageName: '',
    pageIcon: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/header works!/gi)).toBeTruthy();
  },
};
