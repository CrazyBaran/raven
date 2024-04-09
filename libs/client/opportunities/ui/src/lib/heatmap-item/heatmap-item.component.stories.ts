/* eslint-disable @typescript-eslint/no-explicit-any */
import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { HeatmapItem, HeatmapItemComponent } from './heatmap-item.component';

const meta: Meta<HeatmapItemComponent> = {
  component: HeatmapItemComponent,
  title: 'Opportunity DD / Related Notes / Note Heatmap Field / Heatmap Item',
  decorators: [
    componentWrapperDecorator(
      (story) =>
        `<div class="storybook-wrapper" style="max-width:300px">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<HeatmapItemComponent>;

// TODO: remove any when storybook supports new angular input syntax

export const Great: Story = {
  args: {
    item: {
      uniqId: '1',
      heat: 'great',
      title: 'Note Field 1',
      value: '1',
      unit: 'unit',
    } as HeatmapItem as any,
  },
};

export const Good: Story = {
  args: {
    item: {
      uniqId: '1',
      heat: 'good',
      title: 'Note Field 1',
      value: '1',
      unit: 'unit',
    } as HeatmapItem as any,
  },
};

export const Average: Story = {
  args: {
    item: {
      uniqId: '1',
      heat: 'average',
      title: 'Note Field 1',
      value: '1',
      unit: 'unit',
    } as HeatmapItem as any,
  },
};

export const WithoutValue: Story = {
  args: {
    item: {
      heat: 'great',
      title: 'Note Field 1',
      unit: 'unit',
    } as HeatmapItem as any,
  },
};

export const WithToLongTitle: Story = {
  args: {
    item: {
      heat: 'great',
      title:
        'Heat map field 12345 with a very long title that should be wrapped',
      value: '1',
      unit: 'unit',
    } as HeatmapItem as any,
  },
};
