import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CONTROL_DATA, ControlData } from '@app/rvnc-notes/util';
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
