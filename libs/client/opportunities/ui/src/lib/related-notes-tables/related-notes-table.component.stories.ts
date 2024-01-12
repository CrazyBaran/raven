import type { Meta, StoryObj } from '@storybook/angular';
import { RelatedNotesTableComponent } from './related-notes-table.component';

const meta: Meta<RelatedNotesTableComponent> = {
  component: RelatedNotesTableComponent,
  title: 'RelatedNotesTableComponent',
};
export default meta;
type Story = StoryObj<RelatedNotesTableComponent>;

export const Primary: Story = {
  args: {},
};
