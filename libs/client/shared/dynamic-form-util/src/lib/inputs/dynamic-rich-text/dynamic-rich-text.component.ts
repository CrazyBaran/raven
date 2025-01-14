import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
// TODO: Fix this import
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DynamicRichTextControl } from '@app/client/shared/dynamic-form-util';
import {
  EditorComponent,
  EditorModule,
  Plugin,
  schema,
} from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import {
  BaseDynamicControlComponent,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '../../base-dynamic-control-component.directive';
import { inputRule } from '../../utils/input.rule';
import { DYNAMIC_RICH_TEXT_PROSE_MIRROR_SETTINGS } from './provide-prose-mirror-settings.directive';

@Component({
  selector: 'app-dynamic-rich-text',
  standalone: true,
  imports: [sharedDynamicControlDeps, EditorModule, TextBoxModule],
  templateUrl: './dynamic-rich-text.component.html',
  styleUrls: ['./dynamic-rich-text.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DynamicRichTextComponent
  extends BaseDynamicControlComponent<DynamicRichTextControl>
  implements OnInit, AfterViewInit
{
  @HostBinding('class.rich-text-full') public grow: boolean | undefined;
  @ViewChild(EditorComponent) protected editor: EditorComponent;

  public proseSettings = inject(DYNAMIC_RICH_TEXT_PROSE_MIRROR_SETTINGS, {
    optional: true,
  });

  public mySchema = this.proseSettings?.proseMirrorSettings?.schema ?? schema;

  public myPlugins = (args: Plugin[]): Plugin[] => [
    ...args,
    ...(this.proseSettings?.proseMirrorSettings?.plugins ?? []),
    inputRule(this.mySchema),
  ];

  public override ngOnInit(): void {
    super.ngOnInit();
    this.grow = this.control.config.grow;
  }

  public addIndent($event: Event): void {
    $event.preventDefault();
    this.editor.exec('indent');
  }
  public removeIndent($event: Event): void {
    $event.preventDefault();
    this.editor.exec('outdent');
  }
  protected setFocus(): void {
    this.focusHandler?.focusTo(this.control.controlKey);
  }

  protected override onFocus = (): void => {
    this.editor?.focus();

    if (!this.editor.value) {
      this.editor.exec('insertUnorderedList');
    }

    this.elementRef?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };
}
