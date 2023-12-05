/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ENVIRONMENT } from '@app/client/core/environment';
import {
  IFilePickerOptions,
  IPicker,
  MSALAuthenticate,
  Picker,
  Popup,
} from '@app/client/files/sdk-pnptimeline';
import { MsalService } from '@azure/msal-angular';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-picker',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickerComponent {
  @Input() public type: 'sharepoint' | 'onedrive' = 'sharepoint';
  @Input() public name: string;
  @Input() public path: string;
  @Input() public url: string;

  protected env = inject(ENVIRONMENT);
  protected msal = inject(MsalService);

  public async createWindow(e: MouseEvent): Promise<void> {
    e.preventDefault();

    const options: IFilePickerOptions = {
      sdk: '8.0',
      entry:
        this.type === 'sharepoint'
          ? {
              sharePoint: {
                byPath: {
                  list: this.path,
                },
              },
            }
          : {
              oneDrive: {
                files: {},
              },
            },
      authentication: {},
      messaging: {
        origin: this.env.adRedirectUri,
        channelId: '27',
      },
      search: {
        enabled: true,
      },
      selection: {
        mode: 'multiple',
        maxCount: 5,
      },
      typesAndSources: {
        mode: 'all',
      },
    };

    // setup the picker with the desired behaviors
    const picker = Picker(
      window.open('', 'Picker', 'width=800,height=600')!,
    ).using(Popup(), MSALAuthenticate(this.msal.instance));

    // optionally log notifications to the console
    picker.on.notification(function (this: IPicker, message) {
      console.log('notification: ' + JSON.stringify(message));
    });

    // optionially log any logging from the library itself to the console
    picker.on.log(function (this: IPicker, message: any, level: any) {
      console.log(`log: [${level}] ${message}`);
    } as any);

    // activate the picker with our baseUrl and options object
    const results = await picker.activate({
      baseUrl: this.url,
      options,
    });

    console.log(results);
  }
}
