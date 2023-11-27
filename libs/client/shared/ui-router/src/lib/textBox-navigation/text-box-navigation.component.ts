import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputSize, TextBoxModule } from '@progress/kendo-angular-inputs';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
  imports: [CommonModule, TextBoxModule, ReactiveFormsModule],
  templateUrl: './text-box-navigation.component.html',
  styleUrls: ['./text-box-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextBoxNavigationComponent {
  public navigationControl = new FormControl();

  private _model: Required<TextBoxNavigationModel> =
    textBoxNavigationModelDefaults;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.navigationControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(this.model.debounceTime),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.router.navigate([], {
          relativeTo: this.route,
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
