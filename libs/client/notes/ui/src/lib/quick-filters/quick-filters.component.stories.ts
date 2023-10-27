import type { Meta, StoryObj } from '@storybook/angular';
import { QuickFiltersComponent } from './quick-filters.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<QuickFiltersComponent> = {
  component: QuickFiltersComponent,
  title: 'QuickFiltersComponent',
};
export default meta;
type Story = StoryObj<QuickFiltersComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/quick-filters works!/gi)).toBeTruthy();
  },
};
