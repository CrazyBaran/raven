import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { RxIf } from '@rx-angular/template/if';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import { BaseNavigationComponent } from '../base-navigation-component.directive';

export type DropdownNavigationItem = {
  id: string | null | undefined;
  name: string;
};

export type DropdownNavigationModel = {
  queryParamName: string;
  data: DropdownNavigationItem[];
  defaultItem: DropdownNavigationItem;
  value: DropdownNavigationItem | null | undefined;
  loading?: boolean | undefined | null;
  strategy?: 'preserve' | 'merge';
};

@Component({
  selector: 'app-dropdown-navigation',
  standalone: true,
  imports: [CommonModule, DropDownListModule, RxIf, ButtonModule, RxUnpatch],
  templateUrl: './dropdown-navigation.component.html',
  styleUrls: ['./dropdown-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownNavigationComponent extends BaseNavigationComponent {
  @Input({ required: true }) public model: DropdownNavigationModel;

  protected valueChange($event: { id: string }): void {
    this.navigateWithZone([], {
      relativeTo: this.activatedRoute,
      queryParams: { [this.model.queryParamName]: $event.id },
      queryParamsHandling: this.model.strategy ?? 'merge',
    });
  }
}
