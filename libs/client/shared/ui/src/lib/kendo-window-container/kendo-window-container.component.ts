import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ui-kendo-window-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kendo-window-container.component.html',
  styleUrls: ['./kendo-window-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KendoWindowContainerComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container: ViewContainerRef;
}
