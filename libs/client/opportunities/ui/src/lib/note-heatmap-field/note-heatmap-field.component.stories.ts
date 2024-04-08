/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/angular';
import {
  NoteHeatmap,
  NoteHeatmapFieldComponent,
} from './note-heatmap-field.component';

const meta: Meta<NoteHeatmapFieldComponent> = {
  component: NoteHeatmapFieldComponent,
  title: 'Opportunity DD / Related Notes / Note Heatmap Field',
};
export default meta;
type Story = StoryObj<NoteHeatmapFieldComponent>;

export const Primary: Story = {
  args: {
    heatmap: {
      fields: [
        {
          uniqId: '1',
          title: 'Field 1',
          noteFields: [
            {
              uniqId: '1',
              heat: 'great',
              title: 'Note Field 1',
              value: '1',
              unit: 'unit',
            },
            {
              uniqId: '2',
              heat: 'good',
              title: 'Note Field 2',
              value: '2',
              unit: 'unit',
            },
            {
              uniqId: '3',
              heat: 'average',
              title: 'Note Field 3',
              value: '3',
              unit: 'unit',
            },
          ],
        },
        {
          uniqId: '2',
          title: 'Field 2',
          noteFields: [
            {
              uniqId: '4',
              heat: 'great',
              title: 'Note Field 4',
              value: '4',
              unit: 'unit',
            },
            {
              uniqId: '5',
              heat: 'good',
              title: 'Note Field 5',
              value: '5',
              unit: 'unit',
            },
            {
              uniqId: '6',
              heat: 'average',
              title: 'Note Field 6',
              value: '6',
              unit: 'unit',
            },
          ],
        },
      ],
    } as NoteHeatmap as any,
  },
};
