import { TypeGuard } from './generic.typeguard';

export const isArrayOf =
  <A>(itemGuard: TypeGuard<A>): TypeGuard<Array<A>> =>
  (v: unknown): v is A[] =>
    Array.isArray(v) && v.every(itemGuard);
