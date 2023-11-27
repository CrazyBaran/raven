import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  Input,
} from '@angular/core';
import { BadgeComponent, BadgeStyle } from '@app/client/shared/ui';
import { RxLet } from '@rx-angular/template/let';
import { Observable, of } from 'rxjs';

export interface FileTypeBadgeColorsResolver {
  resolve(fileType: string): Observable<BadgeStyle>;
}

export const FILE_TYPE_BADGE_COLORS =
  new InjectionToken<FileTypeBadgeColorsResolver>('FILE_TYPE_BADGE_COLORS');

@Component({
  selector: 'app-file-type-badge',
  standalone: true,
  imports: [CommonModule, BadgeComponent, RxLet],
  templateUrl: './file-type-badge.component.html',
  styleUrls: ['./file-type-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTypeBadgeComponent {
  @Input() public fileType?: string;

  private _fileTypeBadgeColorsResolver = inject(FILE_TYPE_BADGE_COLORS, {
    optional: true,
  });

  protected get styles$(): Observable<BadgeStyle> {
    return (
      this._fileTypeBadgeColorsResolver?.resolve(this.fileType ?? '') ??
      of({
        backgroundColor: '#e0e0e0',
        color: '#000000',
      })
    );
  }
}
