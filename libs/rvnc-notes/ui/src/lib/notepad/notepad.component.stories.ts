import type { Meta, StoryObj } from '@storybook/angular';
import { NotepadComponent } from './notepad.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<NotepadComponent> = {
  component: NotepadComponent,
  title: 'Notes Ui / Notepad',
};
export default meta;
type Story = StoryObj<NotepadComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/notepad works!/gi)).toBeTruthy();
  },
};
