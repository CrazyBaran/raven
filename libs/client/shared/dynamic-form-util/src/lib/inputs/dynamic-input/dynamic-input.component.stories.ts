import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CONTROL_DATA } from '../../base-dynamic-control-component.directive';
import { ControlData } from '../../control-data.token';
import { DynamicInputComponent } from './dynamic-input.component';

const meta: Meta<DynamicInputComponent> = {
  component: DynamicInputComponent,
  title: 'Notes Ui / Text Input',
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: ControlContainer,
          useFactory: (): ControlContainer => {
            const fg: FormGroup = new FormGroup({});
            const fgd: FormGroupDirective = new FormGroupDirective([], []);
            fgd.form = fg;
            return fgd;
          },
        },
        {
          provide: CONTROL_DATA,
          useValue: {
            controlKey: 'textInputKey',
            config: {
              label: 'test',
              id: 'test',
              order: 1,
              name: 'label',
              type: 'richText',
              placeholder: 'Write something here',
            },
          } as ControlData,
        },
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<DynamicInputComponent>;

export const Primary: Story = {
  args: {},
};

export const Required: Story = {
  args: {},
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: CONTROL_DATA,
          useValue: {
            controlKey: 'textInputKey',
            config: {
              label: 'test',
              id: 'test',
              order: 1,
              name: 'label',
              type: 'richText',
              placeholder: 'Write something here',
              validators: {
                required: true,
              },
            },
          },
        },
      ],
    }),
  ],
};
