import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-related-notes-footer',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './related-notes-footer.component.html',
  styleUrl: './related-notes-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedNotesFooterComponent {
  public pageChange = output<number>();

  public page = input(0);
  public pageSize = input(0);

  protected prevDisabled = computed(() => this.page() <= 0);
  protected nextDisabled = computed(() => this.page() >= this.pageSize() - 1);

  protected next(): void {
    this.pageChange.emit(this.page() + 1);
  }

  protected prev(): void {
    this.pageChange.emit(this.page() - 1);
  }
}
