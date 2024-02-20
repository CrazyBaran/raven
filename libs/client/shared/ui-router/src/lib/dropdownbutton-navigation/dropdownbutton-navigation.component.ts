import { NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';

export type DropdownAction = {
  actionStyle?: { [k: string]: string };
  actionClass?: string;
} & (
  | {
      text: string;
      click: () => void;
    }
  | {
      text: string;
      routerLink: string[];
      queryParamsHandling?: 'merge' | 'preserve';
      queryParams?: { [k: string]: string };
      skipLocationChange?: boolean;
    }
);

export type DropdownbuttonNavigationModel = {
  actions: DropdownAction[];
  iconClass?: string;
};

export const dropdownbuttonNavigationModelDefaults: Required<DropdownbuttonNavigationModel> =
  {
    actions: [],
    iconClass: 'fa-solid fa-ellipsis-vertical',
  };

@Component({
  selector: 'app-dropdownbutton-navigation',
  standalone: true,
  imports: [DropDownButtonModule, RouterLink, NgStyle, NgClass],
  templateUrl: './text-box-navigation.component.html',
  styleUrls: ['./text-box-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownButtonNavigationComponent {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  private _model: Required<DropdownbuttonNavigationModel> =
    dropdownbuttonNavigationModelDefaults;

  public get model(): Required<DropdownbuttonNavigationModel> {
    return this._model;
  }

  @Input({ required: true }) public set model(
    value: DropdownbuttonNavigationModel,
  ) {
    this._model = {
      ...dropdownbuttonNavigationModelDefaults,
      ...value,
    };
  }

  public onItemClick($event: DropdownAction): void {
    if ('routerLink' in $event) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: $event.queryParams,
        queryParamsHandling: $event.queryParamsHandling,
        skipLocationChange: $event.skipLocationChange,
      });
    }
  }
}
