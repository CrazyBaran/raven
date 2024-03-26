import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { RelatedNoteSkeletonComponent } from './related-note-skeleton.component';

const meta: Meta<RelatedNoteSkeletonComponent> = {
  component: RelatedNoteSkeletonComponent,
  title: 'Opportunity DD / Related Notes / Related Note Skeleton',
  decorators: [
    componentWrapperDecorator(
      (story) => `<div style="height:550px">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<RelatedNoteSkeletonComponent>;

export const Primary: Story = {
  args: {},
};
