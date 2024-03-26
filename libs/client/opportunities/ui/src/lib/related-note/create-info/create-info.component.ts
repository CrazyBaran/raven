import { DatePipe } from '@angular/common';
import { Component, HostBinding, input } from '@angular/core';
import { RelatedNote } from '../related-note.component';

@Component({
  selector: 'app-create-info',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './create-info.component.html',
  styleUrl: './create-info.component.scss',
})
export class CreateInfoComponent {
  @HostBinding('class') public class = 'flex grow flex-col gap-1 px-3 py-2';

  public note = input.required<RelatedNote>();
}
