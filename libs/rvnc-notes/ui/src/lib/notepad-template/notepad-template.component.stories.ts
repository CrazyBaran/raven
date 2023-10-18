import type { Meta, StoryObj } from '@storybook/angular';
import { NotepadTemplateComponent } from './notepad-template.component';

const meta: Meta<NotepadTemplateComponent> = {
  component: NotepadTemplateComponent,
  title: 'NotepadTemplateComponent',
};
export default meta;
type Story = StoryObj<NotepadTemplateComponent>;

export const Primary: Story = {
  args: {},
};
