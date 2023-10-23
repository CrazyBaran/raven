import { DialogRef } from '@progress/kendo-angular-dialog';
import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { TagFormComponent } from './tag-form.component';

const meta: Meta<TagFormComponent> = {
  component: TagFormComponent,
  title: 'NOTES UI / Tag Form',
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: DialogRef,
          useValue: {},
        },
      ],
    }),
    componentWrapperDecorator(
      (story) =>
        `<div style="border:1px solid black; width:424px">${story}</div>`,
    ),
  ],
};
export default meta;
type Story = StoryObj<TagFormComponent>;

export const Primary: Story = {
  args: {},
};
