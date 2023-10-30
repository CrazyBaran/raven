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
  args: {
    tags: [
      // mocked list of all type tags atleast 100
      {
        type: 'company',
        id: '1',
        name: 'company 1',
      },
      {
        type: 'company',
        id: '2',
        name: 'company 2',
      },
      {
        type: 'opportunity',
        id: '3',
        name: 'opportunity 1',
      },
    ],
  },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/tag-dropdown works!/gi)).toBeTruthy();
  },
};
