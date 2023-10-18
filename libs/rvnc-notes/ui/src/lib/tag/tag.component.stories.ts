import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/angular';
import { TagComponent } from './tag.component';

const meta: Meta<TagComponent> = {
  component: TagComponent,
  title: 'TagComponent',
  render: (args: TagComponent) => ({
    props: {
      ...args,
      onTagDelete: () => {},
      tagClick: action('tagClick'),
      tagRemove: action('tagRemove'),
    },
  }),
};
export default meta;
type Story = StoryObj<TagComponent>;

export const Primary: Story = {
  args: {
    label: 'Lorem ipsum',
    icon: 'fa-regular fa-tag',
  },
};
