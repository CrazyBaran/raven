import { ControlContainer, FormGroupDirective } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CONTROL_DATA } from '../../base-dynamic-control-component.directive';
import { ControlData } from '../../control-data.token';
import { DynamicRichTextComponent } from './dynamic-rich-text.component';

const meta: Meta<DynamicRichTextComponent> = {
  component: DynamicRichTextComponent,
  title: 'Notes Ui / Rich editor input',
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: ControlContainer,
          useValue: new FormGroupDirective([], []),
        },
        {
          provide: CONTROL_DATA,
          useValue: {
            controlKey: 'test',
            config: {
              id: 'test',
              name: 'Test',
              label: 'Rich editor input',
              type: 'richText',
              value: '',
              order: 1,
            },
          } as ControlData,
        },
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<DynamicRichTextComponent>;

export const Primary: Story = {
  args: {},
};
