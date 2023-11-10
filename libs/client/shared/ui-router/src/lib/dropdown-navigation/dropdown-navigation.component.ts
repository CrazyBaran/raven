import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { RxIf } from '@rx-angular/template/if';

export type DropdownNavigationItem = {
  id: string | null;
  name: string;
};

export type DropdownNavigationModel = {
  queryParamName: string;
  data: DropdownNavigationItem[];
  defaultItem: DropdownNavigationItem;
  value: DropdownNavigationItem | null;
  loading?: boolean;
  strategy?: 'preserve' | 'merge';
};

@Component({
  selector: 'app-dropdown-navigation',
  standalone: true,
  imports: [CommonModule, DropDownListModule, RxIf],
  templateUrl: './dropdown-navigation.component.html',
  styleUrls: ['./dropdown-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownNavigationComponent {
  @Input({ required: true }) public model: DropdownNavigationModel;

  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected valueChange($event: { id: string }): void {
    this.router.navigate([], {
      [this.model.queryParamName]: this.activatedRoute,
      queryParams: { noteType: $event.id },
      queryParamsHandling: this.model.strategy ?? 'merge',
    });
  }
}
