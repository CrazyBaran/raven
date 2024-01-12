import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { data } from 'autoprefixer';

@Component({
  selector: 'app-kanban-group-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './kanban-group-header.component.html',
  styleUrls: ['./kanban-group-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanGroupHeaderComponent {
  @Input() public expandable = true;
  @Input() public length: number;
  @Input() public color: string;
  @Input() public name: string;

  @Output() public expandedChange = new EventEmitter<boolean>();

  protected readonly data = data;

  protected _expanded = signal(false);

  @Input() public set expanded(value: boolean) {
    this._expanded.set(value);
  }

  protected toggleExpand(): void {
    this._expanded.update((value) => !value);
    this.expandedChange.emit(this._expanded());
  }
}
