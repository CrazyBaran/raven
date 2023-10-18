import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  ViewChild,
} from '@angular/core';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '@app/rvnc-notes/util';
import { EditorComponent, EditorModule } from '@progress/kendo-angular-editor';

@Component({
  selector: 'app-dynamic-rich-text',
  standalone: true,
  imports: [sharedDynamicControlDeps, EditorModule],
  templateUrl: './dynamic-rich-text.component.html',
  styleUrls: ['./dynamic-rich-text.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicRichTextComponent extends BaseDynamicControl {
  @Input() protected height = 160;

  @ViewChild(EditorComponent) protected editor: EditorComponent;

  protected currentHeight = computed(() => {
    return `${this.height - (this.focused() ? 50 : 0)}px`;
  });

  protected setFocus(): void {
    this.focusHandler?.focusTo(this.control.controlKey);
  }

  protected override onFocus = (): void => {
    this.editor?.focus();
    this.elementRef?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };
}
