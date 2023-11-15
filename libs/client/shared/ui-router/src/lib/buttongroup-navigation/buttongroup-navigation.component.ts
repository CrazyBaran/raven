import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonGroupModule,
  ButtonsModule,
} from '@progress/kendo-angular-buttons';
import { RxFor } from '@rx-angular/template/for';
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public get filters() {
    return (
      this.model?.filters.map((f) => ({
        ...f,
        queryParams: { [this.model.paramName]: f.id },
      })) ?? []
    );
  }
}
