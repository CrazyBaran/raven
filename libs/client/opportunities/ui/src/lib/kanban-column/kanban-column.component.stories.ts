import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import * as KanbanGroupStories from '../kanban-group/kanban-group.component.stories';
import { KanbanColumnComponent } from './kanban-column.component';

const meta: Meta<KanbanColumnComponent> = {
  component: KanbanColumnComponent,
  title: 'Opportunities UI / Kanban Board / Kanban Column ',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 350px; height: 700px">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<KanbanColumnComponent>;

export const StandaloneColumn: Story = {
  args: {
    column: {
      color: 'red',
      backgroundColor: '#F0882D4D',
      name: 'Column name',
      groups: [KanbanGroupStories.Primary.args!.group!],
    },
  },
};

export const With3Groups: Story = {
  args: {
    column: {
      color: 'red',
      backgroundColor: '#F0882D4D',
      name: 'Column name',
      groups: [
        {
          ...KanbanGroupStories.Primary.args!.group!,
          name: 'Group 1',
          id: '1',
        },
        {
          ...KanbanGroupStories.Primary.args!.group!,
          name: 'Group 2',
          id: '2',
        },
        {
          ...KanbanGroupStories.Primary.args!.group!,
          name: 'Group 3',
          id: '3',
        },
      ],
    },
  },
};
