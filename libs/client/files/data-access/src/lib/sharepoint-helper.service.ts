import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@app/client/core/environment';

@Injectable({
  providedIn: 'root',
})
export class SharepointHelperService {
  public environment = inject(ENVIRONMENT);

  public constructor() {}

  public getSharepointUrl(directory?: string): string {
    const sharepointBaseUrl = `${this.environment.sharepointRoot}${this.environment.sharepointWeb}/${this.environment.sharepointList}/Forms/AllItems.aspx?id=`;
    const sharepointDirectoryParamUrl = `/${this.environment.sharepointWeb}/${
      this.environment.sharepointList
    }/${directory || ''}`;

    return `${sharepointBaseUrl}${encodeURIComponent(
      sharepointDirectoryParamUrl,
    )}`;
  }
}
