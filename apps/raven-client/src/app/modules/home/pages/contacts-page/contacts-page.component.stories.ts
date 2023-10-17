import type { Meta, StoryObj } from '@storybook/angular';
import { ContactsPageComponent } from './contacts-page.component';

const meta: Meta<ContactsPageComponent> = {
  component: ContactsPageComponent,
  title: 'App / ContactsPageComponent',
};
export default meta;
type Story = StoryObj<ContactsPageComponent>;

export const Primary: Story = {
  args: {},
};
