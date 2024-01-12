import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { KanbanGroupComponent } from './kanban-group.component';

const meta: Meta<KanbanGroupComponent> = {
  component: KanbanGroupComponent,
  title: 'Opportunities UI / Kanban Board  / Kanban Group ',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="max-width: 350px;">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<KanbanGroupComponent>;

export const Primary: Story = {
  args: {
    color: 'red',
    expandable: true,
    group: {
      id: '1',
      name: 'Pipeline name',
      length: 4,
      cards: [
        {
          id: '1',
          fields: [],
          organisation: {
            name: 'Organisation name',
            domains: ['domain.pl'],
          },
        },
        {
          id: '2',
          fields: [],
          organisation: {
            name: 'Organisation name 2',
            domains: ['domain.pl'],
          },
        },
        {
          id: '3',
          fields: [],
          organisation: {
            name: 'Organisation name 3',
            domains: ['domain.pl'],
          },
        },
        {
          id: '4',
          fields: [],
          organisation: {
            name: 'Organisation name',
            domains: ['domain.pl'],
          },
        },
        // {
        //   id: '5',
        //   fields: [],
        //   organisation: {
        //     name: 'Organisation name 2',
        //     domains: ['domain.pl'],
        //   },
        // },
        // {
        //   id: '6',
        //   fields: [],
        //   organisation: {
        //     name: 'Organisation name 3',
        //     domains: ['domain.pl'],
        //   },
        // },
        // {
        //   id: '4',
        //   fields: [],
        //   organisation: {
        //     name: 'Organisation name 4',
        //     domains: ['domain.pl'],
        //   },
        // },
      ],
    },
    receiveMode: false,
  },
};

export const ReceiveMode: Story = {
  args: {
    ...Primary.args,
    receiveMode: true,
  },
};

export const LoadMore: Story = {
  args: {
    ...Primary.args,
    loadingMore: true,
  },
};

export const Empty: Story = {
  args: {
    ...Primary.args,
    group: {
      ...Primary.args!.group!,
      length: 0,
      cards: [],
    },
  },
};

export const WithBackground: Story = {
  args: {
    ...Primary.args,
    backgroundColor: '#D281D9',
    group: {
      ...Primary.args!.group!,
    },
  },
};
