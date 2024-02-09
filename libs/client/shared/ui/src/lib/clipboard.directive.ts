import {
  Directive,
  HostListener,
  inject,
  Injectable,
  Input,
} from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';

import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private clipBoard = inject(Clipboard);
  private notificationService = inject(NotificationService);

  public copyToClipboard(
    payload: string,
    notificationSuccess: string = 'Copied to clipboard.',
  ): void {
    this.clipBoard.copy(payload);
    this.notificationService.show({
      content: notificationSuccess,
      cssClass: 'success',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      type: { style: 'success', icon: true },
    });
  }
}

@Directive({
  selector: '[uiClipboard]',
  standalone: true,
  exportAs: 'uiClipboard',
})
export class ClipboardDirective {
  @Input({ alias: 'uiClipboard', required: true }) public payload: string;

  @Input() public clipboardMessage = 'Copied to clipboard.';

  public clipboardService = inject(ClipboardService);

  public constructor(private readonly clipBoard: Clipboard) {}

  @HostListener('click')
  public handleCopyLink(): void {
    this.clipboardService.copyToClipboard(this.payload, this.clipboardMessage);
  }
}
