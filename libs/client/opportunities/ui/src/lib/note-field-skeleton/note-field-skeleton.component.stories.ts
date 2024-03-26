import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { NoteFieldSkeletonComponent } from './note-field-skeleton.component';

const meta: Meta<NoteFieldSkeletonComponent> = {
  component: NoteFieldSkeletonComponent,
  title: 'Opportunity DD / Related Notes / Note Field Skeleton',
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
};
export default meta;
type Story = StoryObj<NoteFieldSkeletonComponent>;

export const Primary: Story = {
  args: {},
};
