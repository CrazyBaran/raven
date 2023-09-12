import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'owners',
})
export class OwnersPipe implements PipeTransform {
  public transform(owners: { id: string; name: string }[]): string {
    if (owners?.length) {
      return owners.map((owner) => owner.name).join(', ');
    }

    return '';
  }
}
