import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/angular';
import { ScrollTabComponent } from './scroll-tab.component';

const meta: Meta<ScrollTabComponent> = {
  component: ScrollTabComponent,
  title: 'ScrollTabComponent',
  render: (args: ScrollTabComponent) => ({
    props: {
      ...args,
      onTagDelete: () => {},
      eyeClick: action('eyeClick'),
      labelClick: action('labelClick'),
    },
  }),
};
export default meta;
type Story = StoryObj<ScrollTabComponent>;

export const Primary: Story = {
  args: {
    label: 'Lorem ipsum dolor',
  },
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    state: 'disabled',
  },
};

export const Active: Story = {
  args: {
    ...Primary.args,
    state: 'active',
  },
};

export const WithoutEye: Story = {
  args: {
    ...Primary.args,
    showEye: false,
  },
};

export const LongLabel: Story = {
  args: {
    ...Primary.args,
    label: 'This is a very long label that should be truncated',
  },
};
