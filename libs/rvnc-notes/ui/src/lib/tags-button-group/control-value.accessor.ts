import { ControlValueAccessor as NgControlValueAccessor } from '@angular/forms';

export abstract class ControlValueAccessor<T = unknown>
  implements NgControlValueAccessor
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange? = (value: T | null): void => {
    //
  };

  public onTouched? = (): void => {
    //
  };

  public registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public abstract writeValue(value: T): void;
}
