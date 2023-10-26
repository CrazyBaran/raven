import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
} from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-delete-note',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DeleteNoteComponent extends DialogContentBase {
  public handleDelete(): void {
    this.dialog.close({
      submit: true,
    });
  }
}
