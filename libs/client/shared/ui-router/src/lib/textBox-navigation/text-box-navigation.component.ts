import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputSize, TextBoxModule } from '@progress/kendo-angular-inputs';
import { RxUnpatch } from '@rx-angular/template/unpatch';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BaseNavigationComponent } from '../base-navigation-component.directive';

export type TextBoxNavigationModel = {
  queryParamName: string;
  urlValue: string;
  size?: InputSize;
  placeholder?: string;
  debounceTime?: number;
  queryParamsHandling?: 'merge' | 'preserve';
};

const textBoxNavigationModelDefaults: Required<TextBoxNavigationModel> = {
  queryParamName: '',
  urlValue: '',
  size: 'large',
  placeholder: '',
  debounceTime: 500,
  queryParamsHandling: 'merge',
};

@Component({
  selector: 'app-text-box-navigation',
  standalone: true,
  imports: [
    CommonModule,
    TextBoxModule,
    ReactiveFormsModule,
    ButtonModule,
    RxUnpatch,
  ],
  templateUrl: './text-box-navigation.component.html',
  styleUrls: ['./text-box-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextBoxNavigationComponent extends BaseNavigationComponent {
  public navigationControl = new FormControl();

  private _model: Required<TextBoxNavigationModel> =
    textBoxNavigationModelDefaults;

  public constructor() {
    super();
    this.navigationControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(this.model.debounceTime),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.navigateWithZone([], {
          relativeTo: this.activatedRoute,
          queryParams: { [this.model.queryParamName]: value || null },
          queryParamsHandling: this.model.queryParamsHandling,
        });
      });
  }

  public get model(): Required<TextBoxNavigationModel> {
    return this._model;
  }

  @Input({ required: true }) public set model(value: TextBoxNavigationModel) {
    this._model = {
      ...textBoxNavigationModelDefaults,
      ...value,
    };

    this.navigationControl.setValue(this.model.urlValue, { emitEvent: false });
  }
}
