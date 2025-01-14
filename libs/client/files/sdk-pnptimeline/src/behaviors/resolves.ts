/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimelinePipe } from '@pnp/core';
import { _Picker } from '../picker';

export function ResolveWithPicks(): TimelinePipe<_Picker> {
  return (instance: _Picker) => {
    instance.on.pick(async function (this: _Picker, data) {
      (this.emit as any)[this.InternalResolveEvent](data);
    });

    return instance;
  };
}
