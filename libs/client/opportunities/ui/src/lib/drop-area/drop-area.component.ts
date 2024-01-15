import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { OpportunityCard } from '../opportunities-card/opportunities-card.component';

@Component({
  selector: 'app-drop-area',
  standalone: true,
  imports: [CdkDropList, TitleCasePipe],
  templateUrl: './drop-area.component.html',
  styleUrls: ['./drop-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropAreaComponent {
  @Input() public name: string;

  @Output() public dropEvent = new EventEmitter<{ opportunityId: string }>();

  protected drop($event: CdkDragDrop<OpportunityCard>): void {
    const opportunityId = $event.item.data.id;
    this.dropEvent.emit({ opportunityId });
  }
}
