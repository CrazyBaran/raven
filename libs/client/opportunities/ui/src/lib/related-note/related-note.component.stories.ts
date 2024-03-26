import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { RelatedNoteComponent } from './related-note.component';

const meta: Meta<RelatedNoteComponent> = {
  component: RelatedNoteComponent,
  title: 'Opportunity DD / Related Notes / Related Note',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="height:500px">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<RelatedNoteComponent>;

export const Primary = {
  args: {
    note: {
      id: '1',
      name: 'Note 1',
      template: 'Note Template 1',
      createdBy: 'John Doe',
      updatedAt: '2021-01-01',
      fields: [
        {
          id: '1',
          name: 'Field 1',
          value: 'Field 1 Value',
        },
        {
          id: '2',
          name: 'Field 2',
          value: 'Field 2 Value',
        },
      ],
    },
  },
};
