import { Pipe, PipeTransform } from '@angular/core';

type ShortlistType = 'custom' | 'personal' | 'main' | 'my';

@Pipe({
  name: 'isPersonalShortlistType',
  standalone: true,
})
export class IsPersonalShortlistTypePipe implements PipeTransform {
  public transform(shortlist?: { type?: ShortlistType }): boolean {
    return shortlist?.type === 'personal';
  }
}

@Pipe({
  name: 'isMainShortlistType',
  standalone: true,
})
export class IisMainShortlistTypePipe implements PipeTransform {
  public transform(shortlist?: { type?: ShortlistType }): boolean {
    return shortlist?.type === 'main';
  }
}

@Pipe({
  name: 'isMyShortlistType',
  standalone: true,
})
export class IsMyShortlistTypePipe implements PipeTransform {
  public transform(shortlist?: { type?: ShortlistType }): boolean {
    return shortlist?.type === 'my';
  }
}

@Pipe({
  name: 'isCustomShortlistType',
  standalone: true,
})
export class IsCustomShortlistTypePipe implements PipeTransform {
  public transform(shortlist?: { type?: ShortlistType }): boolean {
    return shortlist?.type === 'custom';
  }
}

export const shortlistPipes = [
  IsPersonalShortlistTypePipe,
  IisMainShortlistTypePipe,
  IsMyShortlistTypePipe,
  IsCustomShortlistTypePipe,
];
