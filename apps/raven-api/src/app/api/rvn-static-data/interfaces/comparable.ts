export interface Comparable<T> {
  correspondingEntity: string;
  id: string;
  isSame(other: T): boolean;
  unsetNested(): void;
}
