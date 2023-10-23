import type { Meta, StoryObj } from '@storybook/angular';
import { TagDropdownComponent } from './tag-dropdown.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<TagDropdownComponent> = {
  component: TagDropdownComponent,
  title: 'NOTES UI / Tag Dropdown',
};
export default meta;
type Story = StoryObj<TagDropdownComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/tag-dropdown works!/gi)).toBeTruthy();
  },
};
