import type { Meta, StoryObj } from '@storybook/angular';
import { NotesTableComponent } from './notes-table.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<NotesTableComponent> = {
  component: NotesTableComponent,
  title: 'NotesTableComponent',
};
export default meta;
type Story = StoryObj<NotesTableComponent>;

export const Primary: Story = {
  args: {
    notes: [],
  },
};

export const Heading: Story = {
  args: {
    notes: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/notes-table works!/gi)).toBeTruthy();
  },
};
