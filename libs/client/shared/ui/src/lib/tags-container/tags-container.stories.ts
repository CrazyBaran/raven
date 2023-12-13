import { Meta, Story, moduleMetadata } from '@storybook/angular';
import { TagsContainerComponent } from './tags-container.component';

export default {
  title: 'Ui/Tags Container',
  component: TagsContainerComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta;

const Template: Story<TagsContainerComponent> = (
  args: TagsContainerComponent,
) => ({
  props: args,
});

export const With5Tags = Template.bind({});
With5Tags.args = {
  tags: [
    {
      name: 'tag1',
      id: '1',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'tag 2',
      id: '2',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'tag 3',
      id: '3',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'lorem ipsum',
      id: '4',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'Lorem 5',
      id: '5',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
  ],
};

export const With5TagsAnd2Rows = Template.bind({});
With5TagsAnd2Rows.args = {
  rows: 2,
  tags: [
    {
      name: 'tag1',
      id: '1',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'tag 2',
      id: '2',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'tag 3',
      id: '3',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'lorem ipsum',
      id: '4',
      style: {},
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
    {
      name: 'Lorem 5',
      id: '5',
      style: '',
      size: 'medium',
      icon: 'fa-icon fa-regular',
    },
  ],
};
