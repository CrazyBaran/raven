/* eslint-disable @typescript-eslint/member-ordering */
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
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ClickOutsideDirective,
  ControlValueAccessor,
} from '@app/client/shared/util';
import { takeAfterViewInit } from '@app/client/shared/util-rxjs';
import {
  EditorComponent,
  EditorModule,
  Plugin,
  Schema,
  schema,
} from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { mapTo, merge, Subject, switchMap } from 'rxjs';
import {
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '../../base-dynamic-control-component.directive';
import { DYNAMIC_RICH_TEXT_PROSE_MIRROR_SETTINGS } from '../dynamic-rich-text/provide-prose-mirror-settings.directive';

import { inputRule } from '../../utils/input.rule';

@Component({
  selector: 'app-rich-text',
  standalone: true,
  imports: [
    sharedDynamicControlDeps,
    EditorModule,
    TextBoxModule,
    ClickOutsideDirective,
  ],
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
  protected elementRef = inject(ElementRef);

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

  protected _disabled: boolean | undefined;
  @Input() public set disabled(value: boolean | undefined) {
    this._disabled = value;
    this.editor?.blur();
  }

  @Input() public readonly: boolean | undefined;

  public get isDisabled(): boolean {
    return this._disabled ?? this.disabled ?? false;
  }

  @Output() public obBlur = takeAfterViewInit(() => this.editor).pipe(
    switchMap((editor) => editor.onBlur),
  );

  @Output() public valueChange = takeAfterViewInit(() => this.editor).pipe(
    switchMap((editor) => editor.valueChange),
  );

  @ViewChild(EditorComponent) protected editor: EditorComponent;
  @ViewChild('editor', { read: ElementRef })
  protected editorElement: ElementRef;

  public value = '';
  public manualFocus$ = new Subject<void>();
  public focus$ = merge(
    takeAfterViewInit(() => this.editor).pipe(
      switchMap((editor) => editor.onFocus),
    ),
    this.manualFocus$.pipe(mapTo(true)),
  );

  public focused$ = merge(
    this.focus$.pipe(mapTo(true)),
    this.obBlur.pipe(mapTo(false)),
  );

  public focused = toSignal(this.focused$);

  public destroyRef$ = inject(DestroyRef);

  public get mySchema(): Schema<string, string> {
    return this.proseSettings?.proseMirrorSettings?.schema ?? schema;
  }

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
    inputRule(this.mySchema),
  ];

  public writeValue(value: string): void {
    this.value = value;
  }

  public onBlur(): void {
    this.onTouched?.();
  }

  public addIndent($event: Event): void {
    $event.preventDefault();
    this.editor.exec('indent');
  }

  public removeIndent($event: Event): void {
    $event.preventDefault();
    this.editor.exec('outdent');
  }

  protected active = signal(false);

  public setActive(): void {
    if (!this.editor.value) {
      this.elementRef?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    this.manualFocus$.next();
    this.editor.focus();

    if (!this.editor.value) {
      this.editor.exec('insertUnorderedList');
    }

    this.active.set(true);
  }

  public setInactive(): void {
    this.active.set(false);
    this.editor.blur();
  }

  public onFocus(): void {
    this.setActive();
  }
}
