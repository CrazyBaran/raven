import type { Meta, StoryObj } from '@storybook/angular';
import { NoteDetailsComponent } from './note-details.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<NoteDetailsComponent> = {
  component: NoteDetailsComponent,
  title: 'NoteDetailsComponent',
};
export default meta;
type Story = StoryObj<NoteDetailsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/note-details works!/gi)).toBeTruthy();
  },
};
