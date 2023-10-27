import type { Meta, StoryObj } from '@storybook/angular';
import { KanbanBoardComponent } from './kanban-board.component';

const meta: Meta<KanbanBoardComponent> = {
  component: KanbanBoardComponent,
  title: 'App / KanbanBoardComponent',
};
export default meta;
type Story = StoryObj<KanbanBoardComponent>;

export const Primary: Story = {
  args: {
    opportunities: [],
    pipelines: [],
  },
};
