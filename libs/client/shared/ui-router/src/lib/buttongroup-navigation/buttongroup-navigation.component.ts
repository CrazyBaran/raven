import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ButtonGroupModule,
  ButtonsModule,
} from '@progress/kendo-angular-buttons';
import { RxFor } from '@rx-angular/template/for';
import * as _ from 'lodash';
import { ButtongroupNavigationModel } from './buttongroup-navigation.model';

@Component({
  selector: 'app-buttongroup-navigation',
  standalone: true,
  imports: [CommonModule, ButtonGroupModule, RouterLink, ButtonsModule, RxFor],
  templateUrl: './buttongroup-navigation.component.html',
  styleUrls: ['./buttongroup-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtongroupNavigationComponent {
  @Input({ required: true }) public model: ButtongroupNavigationModel;

  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected onClick(
    button: ButtongroupNavigationModel['filters'][number],
  ): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams:
        this.model.toggleable && button.selected
          ? _.mapValues(button.queryParams, (_) => null)
          : button.queryParams,

      queryParamsHandling: this.model.queryParamsHandling ?? 'merge',
    });
  }
}
