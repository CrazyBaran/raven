/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimelinePipe } from '@pnp/core';
import { _Picker } from '../picker';

export function RejectOnErrors(): TimelinePipe<_Picker> {
  return (instance: _Picker) => {
    instance.on.error(function (this: _Picker, err: any) {
      (this.emit as any)[this.InternalRejectEvent](err || null);
    } as any);

    return instance;
  };
}
