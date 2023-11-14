import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputSize, TextBoxModule } from '@progress/kendo-angular-inputs';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-text-box-navigation',
  standalone: true,
  imports: [CommonModule, TextBoxModule, ReactiveFormsModule],
  templateUrl: './text-box-navigation.component.html',
  styleUrls: ['./text-box-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextBoxNavigationComponent {
  @Input() public size: InputSize = 'large';

  @Input({ required: true })
  public queryParamName: string;

  @Input() public placeholder = '';

  @Input() public queryParamsHandling: 'merge' | 'preserve' = 'merge';

  @Input() public debounceTime = 200;

  public navigationControl = new FormControl();

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.navigationControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { [this.queryParamName]: value || null },
          queryParamsHandling: this.queryParamsHandling,
        });
      });
  }

  @Input() public set urlValue(value: string) {
    this.navigationControl.setValue(value, { emitEvent: false });
  }
}
