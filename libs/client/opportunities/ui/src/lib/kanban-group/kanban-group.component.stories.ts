import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import * as OpportunityCardsStories from '../opportunities-card/opportunities-card.component.stories';
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
        OpportunityCardsStories.Primary.args!.model!,
        OpportunityCardsStories.WithDealLeads.args!.model!,
        OpportunityCardsStories.WithAllFields.args!.model!,
        { ...OpportunityCardsStories.WithDealLeads.args!.model!, id: '2' },
      ],
    },
  },
};

export const ReceiveMode: Story = {
  args: {
    ...Primary.args,
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
