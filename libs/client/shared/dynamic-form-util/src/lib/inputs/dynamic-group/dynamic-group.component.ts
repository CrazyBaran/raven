import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';

import { FormGroup } from '@angular/forms';
import {
  NumericTextBoxModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import {
  BaseDynamicControlComponent,
  comparatorFn,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '../../base-dynamic-control-component.directive';
import { ControlInjectorPipe } from '../../control-injector.pipe';
import { DynamicControlResolver } from '../../dynamic-control-resolver.service';
import { DynamicGroupControl } from '../../dynamic-forms.model';

@Component({
  selector: 'app-dynamic-numeric-input',
  standalone: true,
  imports: [
    sharedDynamicControlDeps,
    TextBoxModule,
    NumericTextBoxModule,
    ControlInjectorPipe,
  ],
  templateUrl: './dynamic-group.component.html',
  styleUrls: ['./dynamic-group.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicGroupComponent extends BaseDynamicControlComponent<DynamicGroupControl> {
  @HostBinding('class') protected override hostClass = 'form-field-group';

  protected controlResolver = inject(DynamicControlResolver);
  protected override formControl = new FormGroup({});

  protected override onFocus: () => void;

  protected readonly comparatorFn = comparatorFn;
}
