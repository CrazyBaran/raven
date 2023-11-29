import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  Input,
  Provider,
} from '@angular/core';
import { BadgeComponent, BadgeStyle } from '@app/client/shared/ui';
import { RxLet } from '@rx-angular/template/let';
import { map, Observable, of } from 'rxjs';

export interface NoteTypeBadgeColorsResolver {
  resolve(fileType: string): Observable<BadgeStyle>;
}

export const NOTE_TYPE_BADGE_COLORS =
  new InjectionToken<NoteTypeBadgeColorsResolver>('NOTE_TYPE_BADGE_COLORS');

export const provideNoteTypeBadgeColors = (
  source: () => Observable<Record<string, BadgeStyle>>,
): Provider => {
  return {
    provide: NOTE_TYPE_BADGE_COLORS,
    useValue: {
      resolve: (fileType: string) =>
        source().pipe(
          map(
            (colors) =>
              colors[fileType] ?? {
                backgroundColor: '#e0e0e0',
                color: '#000000',
              },
          ),
        ),
    },
  };
};

@Component({
  selector: 'app-note-type-badge',
  standalone: true,
  imports: [CommonModule, BadgeComponent, RxLet],
  templateUrl: './note-type-badge.component.html',
  styleUrls: ['./note-type-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteTypeBadgeComponent {
  @Input() public type?: string;

  private _fileTypeBadgeColorsResolver = inject(NOTE_TYPE_BADGE_COLORS, {
    optional: true,
  });

  protected get styles$(): Observable<BadgeStyle> {
    return (
      this._fileTypeBadgeColorsResolver?.resolve(this.type ?? '') ??
      of({
        backgroundColor: '#e0e0e0',
        color: '#000000',
      })
    );
  }
}
