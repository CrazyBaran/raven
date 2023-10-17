import type { Meta, StoryObj } from '@storybook/angular';
import { NotesPageComponent } from './notes-page.component';

const meta: Meta<NotesPageComponent> = {
  component: NotesPageComponent,
  title: 'App / NotesPageComponent',
};
export default meta;
type Story = StoryObj<NotesPageComponent>;

export const Primary: Story = {
  args: {},
};
