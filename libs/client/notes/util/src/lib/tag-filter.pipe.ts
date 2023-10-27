import { Pipe, PipeTransform } from '@angular/core';
import { NoteTagData } from '@app/rvns-notes/data-access';

@Pipe({
  name: 'tagFilter',
  standalone: true,
})
export class TagFilterPipe implements PipeTransform {
  public transform(
    tags: NoteTagData[],
    tagTypes: string[],
    include = true,
  ): NoteTagData[] {
    if (include) {
      return tags.filter((tag) => tagTypes.includes(tag.type));
    }

    return tags.filter((tag) => !tagTypes.includes(tag.type));
  }
}
