import type { Meta, StoryObj } from '@storybook/angular';
import { OpportunityDetailsPageComponent } from './opportunity-details-page.component';

import { provideMockStore } from '@ngrx/store/testing';
import { moduleMetadata } from '@storybook/angular';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<OpportunityDetailsPageComponent> = {
  component: OpportunityDetailsPageComponent,
  title: 'OpportunityDetailsPageComponent',
  decorators: [
    moduleMetadata({
      providers: [provideMockStore({})],
    }),
  ],
};
export default meta;
type Story = StoryObj<OpportunityDetailsPageComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/opportunity-details-page works!/gi)).toBeTruthy();
  },
};
