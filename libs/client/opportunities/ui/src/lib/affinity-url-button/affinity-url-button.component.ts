import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-affinity-url-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './affinity-url-button.component.html',
  styleUrl: './affinity-url-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffinityUrlButtonComponent {
  @Input() public url: string;

  @Input() public vertical: boolean;

  public openAffinityUrl(): void {
    window.open(this.url, '_blank');
  }
}
