import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { KanbanGroupHeaderComponent } from './kanban-group-header.component';

const meta: Meta<KanbanGroupHeaderComponent> = {
  component: KanbanGroupHeaderComponent,
  title: 'Opportunities UI / Kanban Board /  Kanban Group Header ',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 350px;">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<KanbanGroupHeaderComponent>;

export const Primary: Story = {
  args: {
    expandable: true,
    length: 15,
    color: '',
    name: 'Lorem ipsum dolor',
    expanded: false,
  },
};

export const Expanded: Story = {
  args: {
    ...Primary.args,
    expanded: true,
  },
};

export const notExpandable: Story = {
  args: {
    ...Primary.args,
    expandable: false,
  },
};

export const withColor: Story = {
  args: {
    ...Primary.args,
    color: 'red',
  },
};
