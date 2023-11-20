import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  HostBinding,
  inject,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@app/client/shared/util';
import { takeAfterViewInit } from '@app/client/shared/util-rxjs';
import {
  EditorComponent,
  EditorModule,
  Plugin,
  schema,
} from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { mapTo, merge, switchMap } from 'rxjs';
import {
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '../../base-dynamic-control';
import { DYNAMIC_RICH_TEXT_PROSE_MIRROR_SETTINGS } from '../dynamic-rich-text/provide-prose-mirror-settings.directive';

@Component({
  selector: 'app-rich-text',
  standalone: true,
  imports: [sharedDynamicControlDeps, EditorModule, TextBoxModule],
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RichTextComponent),
    },
  ],
})
export class RichTextComponent
  extends ControlValueAccessor<string>
  implements AfterViewInit
{
  @Input() @HostBinding('class.rich-text-full') public grow:
    | boolean
    | undefined;

  @Input() public placeholder: string | undefined;

  @Input() @HostBinding('class.rich-text-borderless') public borderless:
    | boolean
    | undefined;

  @Input() public proseSettings = inject(
    DYNAMIC_RICH_TEXT_PROSE_MIRROR_SETTINGS,
    {
      optional: true,
    },
  );

  @Output() public obBlur = takeAfterViewInit(() => this.editor).pipe(
    switchMap((editor) => editor.onBlur),
  );

  @ViewChild(EditorComponent) protected editor: EditorComponent;
  @ViewChild('editor', { read: ElementRef })
  protected editorElement: ElementRef;

  public value = '';
  public focus$ = takeAfterViewInit(() => this.editor).pipe(
    switchMap((editor) => editor.onFocus),
  );

  public active$ = merge(
    this.focus$.pipe(mapTo(true)),
    this.obBlur.pipe(mapTo(false)),
  );

  public active = toSignal(this.active$);

  public mySchema = this.proseSettings?.proseMirrorSettings?.schema ?? schema;

  public destroyRef$ = inject(DestroyRef);

  public ngAfterViewInit(): void {
    this.editor.valueChange
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((value) => {
        this.onChange?.(value);
      });
  }

  public myPlugins = (args: Plugin[]): Plugin[] => [
    ...args,
    ...(this.proseSettings?.proseMirrorSettings?.plugins ?? []),
  ];

  public writeValue(value: string): void {
    // setTimeout(() => {
    //   this.editor.writeValue(value);
    // });
    this.value = value;
  }

  public onBlur(): void {
    this.onTouched?.();
  }
}
