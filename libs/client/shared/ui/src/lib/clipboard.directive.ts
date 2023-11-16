import {
  Directive,
  HostListener,
  inject,
  InjectionToken,
  Input,
} from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';

import { Clipboard } from '@angular/cdk/clipboard';

export const CLIPBOARD_DIRECTIVE_SETTINGS = new InjectionToken(
  'Clipboard Directive Settings',
  {
    providedIn: 'root',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    factory: () => {
      const notificationService = inject(NotificationService, {
        optional: true,
      });

      return {
        onClipboardCopyFn: (message: string): void => {
          if (notificationService) {
            notificationService.show({
              content: message,
              cssClass: 'success',
              animation: { type: 'slide', duration: 400 },
              position: { horizontal: 'center', vertical: 'top' },
              type: { style: 'success', icon: true },
            });
          } else {
            console.log(message);
          }
        },
      };
    },
  },
);

@Directive({
  selector: '[uiClipboard]',
  standalone: true,
  exportAs: 'uiClipboard',
})
export class ClipboardDirective {
  @Input({ alias: 'uiClipboard', required: true }) public payload: string;

  @Input() public clipboardMessage = 'Copied to clipboard.';

  public clipboardSettings = inject(CLIPBOARD_DIRECTIVE_SETTINGS);

  public constructor(private readonly clipBoard: Clipboard) {}

  @HostListener('click')
  public handleCopyLink(): void {
    this.clipBoard.copy(this.payload);
    this.clipboardSettings?.onClipboardCopyFn?.(this.clipboardMessage);
  }
}
