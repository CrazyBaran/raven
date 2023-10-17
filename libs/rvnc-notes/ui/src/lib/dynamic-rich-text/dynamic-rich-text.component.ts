import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BaseDynamicControl,
  ErrorMessagePipe,
  dynamicControlProvider,
} from '@app/rvnc-notes/util';
import { EditorModule } from '@progress/kendo-angular-editor';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

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
  imports: [
    CommonModule,
    FormFieldModule,
    LabelModule,
    ReactiveFormsModule,
    EditorModule,
    ErrorMessagePipe,
    ClickOutsideDirective,
  ],
  templateUrl: './dynamic-rich-text.component.html',
  styleUrls: ['./dynamic-rich-text.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicRichTextComponent extends BaseDynamicControl {
  focused = signal(false);
}
