import { Injectable } from '@nestjs/common';
import {
  AddedRemovedChange,
  BaseChange,
  ChangeType,
  ModifiedChange,
} from './dto/change.dto';
import { Comparable } from './interfaces/comparable';
import { Comparer } from './interfaces/comparer.interface';

@Injectable()
export class AbstractComparer<T extends Comparable<T>>
  implements Comparer<Comparable<T>>
{
  public compareOne(oldData: T, newData: T): BaseChange {
    if (!oldData) {
      return new AddedRemovedChange(
        ChangeType.Added,
        newData.correspondingEntity,
        newData,
      );
    }
    if (!newData) {
      return new AddedRemovedChange(
        ChangeType.Removed,
        oldData.correspondingEntity,
        oldData,
      );
    }
    if (!oldData.isSame(newData))
      return new ModifiedChange(oldData.correspondingEntity, oldData, newData);
  }

  public compareMany(oldData: T[], newData: T[]): BaseChange[] {
    const added = newData
      .filter(
        (newEntity) =>
          !oldData.some((oldEntity) => oldEntity.id === newEntity.id),
      )
      .map(
        (newEntity) =>
          new AddedRemovedChange(
            ChangeType.Added,
            newEntity.correspondingEntity,
            newEntity,
          ),
      );
    const removed = oldData
      .filter(
        (oldEntity) =>
          !newData.some((newEntity) => newEntity.id === oldEntity.id),
      )
      .map(
        (oldEntity) =>
          new AddedRemovedChange(
            ChangeType.Removed,
            oldEntity.correspondingEntity,
            oldEntity,
          ),
      );
    const modified = newData
      .filter((newEntity) =>
        oldData.some((oldEntity) => oldEntity.id === newEntity.id),
      )
      .map((newEntity) => {
        const oldEntity = oldData.find(
          (oldEntity) => oldEntity.id === newEntity.id,
        );
        if (!oldEntity) {
          return undefined;
        }
        return this.compareOne(oldEntity, newEntity);
      })
      .filter((change) => change !== undefined);
    return [...added, ...removed, ...modified];
  }
  public unsetNestedProperties(changes: BaseChange[]): void {
    changes.forEach((change) => {
      if (change instanceof AddedRemovedChange) {
        change.data.unsetNested();
      }
      if (change instanceof ModifiedChange) {
        change.oldData.unsetNested();
        change.newData.unsetNested();
      }
    });
  }
}
