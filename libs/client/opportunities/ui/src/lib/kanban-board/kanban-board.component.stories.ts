import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { KanbanBoardComponent } from './kanban-board.component';

import { DialogModule } from '@progress/kendo-angular-dialog';
import * as KanbanColumnStories from '../kanban-column/kanban-column.component.stories';

const meta: Meta<KanbanBoardComponent> = {
  component: KanbanBoardComponent,
  title: 'Opportunities UI / Kanban Board  ',
  decorators: [
    moduleMetadata({
      imports: [DialogModule],
    }),
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
      footers: [
        {
          name: 'Pass',
          id: 'pass',
          theme: 'warning',
          reminder: true,
          removeSwitch: true,
          droppableFrom: [],
        },
        {
          name: 'Lost',
          id: 'lost',
          theme: 'warning',
          reminder: true,
          removeSwitch: true,
          droppableFrom: [],
        },
        {
          name: 'Won',
          id: 'won',
          theme: 'success',
          reminder: false,
          removeSwitch: false,
          droppableFrom: [],
        },
      ],
    },
  },
};
