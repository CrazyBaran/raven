import { Directive, InjectionToken, Input, forwardRef } from '@angular/core';
import { Plugin, Schema } from '@progress/kendo-angular-editor';

export interface ProvideProseMirrorSettings {
  proseMirrorSettings: { plugins?: Plugin[]; schema?: Schema };
}

export const DYNAMIC_RICH_TEXT_PROSE_MIRROR_SETTINGS =
  new InjectionToken<ProvideProseMirrorSettings>(
    'Dynamic rich text prose mirror settings',
  );

@Directive({
  selector: '[appProseMirrorSettings]',
  providers: [
    {
      provide: DYNAMIC_RICH_TEXT_PROSE_MIRROR_SETTINGS,
      useExisting: forwardRef(() => ProvideProseMirrorSettingsDirective),
    },
  ],
  standalone: true,
})
export class ProvideProseMirrorSettingsDirective
  implements ProvideProseMirrorSettings
{
  @Input() public appProseMirrorSettings: {
    plugins?: Plugin[];
    schema?: Schema;
  } = {};

  public get proseMirrorSettings(): { plugins?: Plugin[]; schema?: Schema } {
    return this.appProseMirrorSettings;
  }
}
