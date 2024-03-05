import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonGroupModule,
  ButtonsModule,
} from '@progress/kendo-angular-buttons';
import { RxFor } from '@rx-angular/template/for';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import * as _ from 'lodash';
import { BaseNavigationComponent } from '../base-navigation-component.directive';
import { ButtongroupNavigationModel } from './buttongroup-navigation.model';

@Component({
  selector: 'app-buttongroup-navigation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonGroupModule,
    RouterLink,
    ButtonsModule,
    RxFor,
    RxUnpatch,
  ],
  templateUrl: './buttongroup-navigation.component.html',
  styleUrls: ['./buttongroup-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtongroupNavigationComponent extends BaseNavigationComponent {
  @Input({ required: true }) public model: ButtongroupNavigationModel;

  @Input() public suffixTemplate: TemplateRef<unknown> | null = null;

  protected onClick(
    button: ButtongroupNavigationModel['filters'][number],
  ): void {
    this.navigateWithZone([], {
      relativeTo: this.activatedRoute,
      queryParams:
        this.model.toggleable && button.selected
          ? _.mapValues(button.queryParams, (_) => null)
          : button.queryParams,

      queryParamsHandling: this.model.queryParamsHandling ?? 'merge',
    });
  }
}
