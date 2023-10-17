import type { Meta, StoryObj } from '@storybook/angular';
import { CompaniesPageComponent } from './companies-page.component';

const meta: Meta<CompaniesPageComponent> = {
  component: CompaniesPageComponent,
  title: 'App / CompaniesPageComponent',
};
export default meta;
type Story = StoryObj<CompaniesPageComponent>;

export const Primary: Story = {
  args: {},
};
