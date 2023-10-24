import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';

import { CONTROL_DATA, ControlData } from '../../control-data.token';
import { DynamicRichTextComponent } from './dynamic-rich-text.component';

describe('DynamicRichTextComponent', () => {
  let component: DynamicRichTextComponent;
  let fixture: ComponentFixture<DynamicRichTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicRichTextComponent],
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
              name: 'test',
              placeholder: 'Write something here',
            },
          } as ControlData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicRichTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
