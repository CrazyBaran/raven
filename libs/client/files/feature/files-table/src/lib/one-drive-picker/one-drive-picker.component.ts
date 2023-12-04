/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-member-accessibility,@typescript-eslint/explicit-function-return-type,@typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

import {
  IAuthenticateCommand,
  IFilePickerOptions,
  INotificationData,
  IPickData,
  ODSPInit,
  OneDriveConsumerInit,
  Picker,
} from './picker-sdk';

import { getToken } from './picker-sdk/auth';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ENVIRONMENT } from '@app/client/core/environment';
import { MsalService } from '@azure/msal-angular';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-one-drive-picker',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './one-drive-picker.component.html',
  styleUrls: ['./one-drive-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneDrivePickerComponent {
  @Input() public type: 'sharepoint' | 'onedrive' = 'sharepoint';
  @Input() public name: string;
  @Input() public path: string;
  @Input() public url: string;

  protected env = inject(ENVIRONMENT);
  protected msal = inject(MsalService);

  sharepoint_baseUrl = 'https://tenant-my.sharepoint.com';

  async launchOneDrivePicker(e: MouseEvent) {
    e.preventDefault();

    const accountType: 'Consumer' | 'ODSP' =
      this.type === 'onedrive' ? 'Consumer' : 'ODSP';

    const init: OneDriveConsumerInit | ODSPInit =
      this.getOneDriveInit(accountType);

    // setup the picker with the desired behaviors
    const picker = await Picker(
      window.open('', 'Picker', 'width=800,height=600')!,
      init,
    );

    picker.addEventListener('pickernotifiation', ((
      e: CustomEvent<INotificationData>,
    ) => {
      console.log('picker notification: ' + JSON.stringify(e.detail));
    }) as any);

    picker.addEventListener('pickerchange', ((e: CustomEvent<IPickData>) => {
      console.log('picker change: ' + JSON.stringify(e.detail));
    }) as any);
  }

  getFilePickerOptions(accountType: string): IFilePickerOptions {
    if (accountType == 'Consumer') {
      return {
        sdk: '8.0',
        entry: {
          oneDrive: {},
        },
        authentication: {},
        messaging: {
          origin: this.env.adRedirectUri,
          channelId: '27',
        },
      };
    } else {
      return {
        sdk: '8.0',
        entry: {
          sharePoint: {
            byPath: {
              web: this.sharepoint_baseUrl,
              list: 'SitePages',
            },
          },
        },
        authentication: {},
        messaging: {
          origin: this.env.adRedirectUri,
          channelId: '27',
        },
        typesAndSources: {
          mode: 'all',
          filters: ['.aspx'],
          pivots: {
            recent: false,
            oneDrive: false,
          },
        },
      };
    }
  }

  getOneDriveInit(accountType: string): OneDriveConsumerInit | ODSPInit {
    const options: IFilePickerOptions = this.getFilePickerOptions(accountType);

    let authCmd: IAuthenticateCommand | null = null;

    if (accountType == 'Consumer') {
      authCmd = {
        command: 'authenticate',
        type: 'Graph',
        resource: '',
      };
      const init: OneDriveConsumerInit = {
        type: 'Consumer',
        options,
        tokenFactory: () => getToken(authCmd!, this.msal.instance),
      };

      return init;
    } else {
      authCmd = {
        command: 'authenticate',
        type: 'SharePoint',
        resource: this.sharepoint_baseUrl,
      };

      const init: ODSPInit = {
        type: 'ODSP',
        baseUrl: this.sharepoint_baseUrl,
        options,
        tokenFactory: () => getToken(authCmd!, this.msal.instance),
      };
      return init;
    }
  }
}
