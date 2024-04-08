import type { Meta, StoryObj } from '@storybook/angular';
import { NotepadComponent } from './notepad.component';

import { DynamicControl } from '@app/client/shared/dynamic-form-util';
import { componentWrapperDecorator } from '@storybook/angular';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<NotepadComponent> = {
  component: NotepadComponent,
  title: 'Notes Ui / Notepad',
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div class="storybook-wrapper" style="height: 650px; width:650px; border:1px solid black">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<NotepadComponent>;

export const Primary: Story = {
  args: {
    config: {
      title: {
        type: 'text',
        label: 'Title',
        order: 1,
        value: '',
      },
      description: {
        type: 'richText',
        label: 'Description',
        order: 2,
        value: '',
      },
      content: {
        type: 'richText',
        label: 'Content',
        order: 3,
        value: '',
      },
      market: {
        type: 'text',
        label: 'Market/Competition',
        order: 5,
        value: '',
      },
      product: {
        type: 'richText',
        label: 'Product/Tech',
        order: 6,
        value: '',
      },
      team: {
        controlType: 'richText',
        label: 'Team/Founding Story',
        order: 7,
        value: '',
      },
    } as unknown as Record<string, DynamicControl>,
  },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/notepad works!/gi)).toBeTruthy();
  },
};
