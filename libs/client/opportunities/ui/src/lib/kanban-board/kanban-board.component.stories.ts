import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { KanbanBoardComponent } from './kanban-board.component';

import * as KanbanColumnStories from '../kanban-column/kanban-column.component.stories';

const meta: Meta<KanbanBoardComponent> = {
  component: KanbanBoardComponent,
  title: 'Opportunities UI / Kanban Board  ',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style=" height: 700px">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<KanbanBoardComponent>;

export const Primary: Story = {
  args: {
    board: {
      columns: [
        {
          ...KanbanColumnStories.With3Groups.args!.column!,
        },
        {
          ...KanbanColumnStories.StandaloneColumn.args!.column!,
        },
        {
          ...KanbanColumnStories.With3Groups.args!.column!,
        },
        {
          ...KanbanColumnStories.StandaloneColumn.args!.column!,
        },
      ],
    },
  },
};
