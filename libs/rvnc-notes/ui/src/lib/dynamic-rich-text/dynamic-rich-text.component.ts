import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '@app/rvnc-notes/util';
import { EditorComponent, EditorModule } from '@progress/kendo-angular-editor';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}

  @Output() clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }
}

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
  @Input() height = 160;

  @ViewChild(EditorComponent) editor: EditorComponent;

  currentHeight = computed(() => {
    return `${this.height - (this.focused() ? 50 : 0)}px`;
  });

  setFocus() {
    this.focusHandler?.focusTo(this.control.controlKey);
  }

  override onFocus = () => {
    this.editor?.focus();
    this.elementRef?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };
}
