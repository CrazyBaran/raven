import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  Input,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { EditorComponent, EditorModule } from '@progress/kendo-angular-editor';
import {
  BaseDynamicControl,
  dynamicControlProvider,
  sharedDynamicControlDeps,
} from '../../base-dynamic-control';

@Component({
  selector: 'app-dynamic-rich-text',
  standalone: true,
  imports: [sharedDynamicControlDeps, EditorModule],
  templateUrl: './dynamic-rich-text.component.html',
  styleUrls: ['./dynamic-rich-text.component.scss'],
  viewProviders: [dynamicControlProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DynamicRichTextComponent
  extends BaseDynamicControl
  implements OnInit, AfterViewInit
{
  // setup observer for elementRef

  @HostBinding('class.rich-text-full') public grow: boolean | undefined;

  @ViewChild(EditorComponent) protected editor: EditorComponent;

  protected heightSignal = signal(0);

  protected currentHeight = computed(() => {
    if (this.grow) {
      return `calc(100% - ${this.focused() ? 50 : 0}px)`;
    }
    return `${this.heightSignal() - (this.focused() ? 50 : 0) - 20}px`;
  });

  @Input() protected set height(value: number) {
    this.heightSignal.set(value);
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.grow = this.control.config.grow;
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.heightSignal.set(this.elementRef.nativeElement.offsetHeight);
  }

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
