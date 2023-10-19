import type { Meta, StoryObj } from '@storybook/angular';
import { LoaderComponent } from './loader.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<LoaderComponent> = {
  component: LoaderComponent,
  title: 'LoaderComponent',
};
export default meta;
type Story = StoryObj<LoaderComponent>;

export const Primary: Story = {
  args: {
    loaderInfo: 'Loading...',
    disableInfo: false,
  },
};

export const Heading: Story = {
  args: {
    loaderInfo: 'Loading...',
    disableInfo: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/loader works!/gi)).toBeTruthy();
  },
};
