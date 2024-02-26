import { Pipe, PipeTransform } from '@angular/core';
import { TagItem } from '@app/client/shared/ui';

@Pipe({
  name: 'toUserTag',
  standalone: true,
})
export class ToUserTagPipe implements PipeTransform {
  public transform(users: string[] | undefined | null): TagItem[] {
    return (
      users?.map((user) => ({
        name: user,
        icon: 'fa-solid fa-user',
        id: user,
        size: 'medium',
      })) ?? []
    );
  }
}
