import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  WritableSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { RxIf } from '@rx-angular/template/if';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import { debounceTime, filter, map } from 'rxjs';
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
  filterable?: boolean;
};

@Component({
  selector: 'app-dropdown-navigation',
  standalone: true,
  imports: [CommonModule, DropDownListModule, RxIf, ButtonModule, RxUnpatch],
  templateUrl: './dropdown-navigation.component.html',
  styleUrls: ['./dropdown-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownNavigationComponent
  extends BaseNavigationComponent
  implements OnChanges
{
  @Input({ required: true }) public model: DropdownNavigationModel;
  @Input() public filterable = false;

  @Output() public filterChanged = new EventEmitter<string>();

  protected filterValue = signal('');
  protected filter$ = toObservable(this.filterValue);
  protected currentFilter = '';
  protected filteredItems: WritableSignal<DropdownNavigationModel | null>;

  public constructor() {
    super();
    this.filter$
      .pipe(
        takeUntilDestroyed(),
        debounceTime(350),
        filter((fv) => fv !== this.currentFilter),
        map((v) => {
          this.filterChanged.emit(v);
          this.currentFilter = v;
        }),
      )
      .subscribe(() => {});
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      const newModel = {
        ...this.model,
        data: this.model.data.filter(
          (d) =>
            d.name.toLowerCase().indexOf(this.currentFilter.toLowerCase()) >
              -1 || !d,
        ),
      };
      if (!this.filteredItems) {
        this.filteredItems = signal(newModel);
      } else {
        this.filteredItems.set(newModel);
      }
    }
  }
  protected valueChange($event: { id: string }): void {
    this.navigateWithZone([], {
      relativeTo: this.activatedRoute,
      queryParams: { [this.model.queryParamName]: $event.id },
      queryParamsHandling: this.model.strategy ?? 'merge',
    });
  }
}
