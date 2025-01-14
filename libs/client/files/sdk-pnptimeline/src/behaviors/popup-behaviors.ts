/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimelinePipe } from '@pnp/core';
import { _Picker } from '../picker';
import { LogNotifications } from './log-notifications';
import { ResolveWithPicks } from './resolves';
import { Setup } from './setup';

export function Close(): TimelinePipe<_Picker> {
  return (instance: _Picker) => {
    instance.on.close(function (this: _Picker) {
      (this.emit as any)[this.InternalResolveEvent](null);
      this.window.close();
    });

    return instance;
  };
}

export function CloseOnPick(): TimelinePipe<_Picker> {
  return (instance: _Picker) => {
    instance.on.pick(async function (this: _Picker, data) {
      this.window.close();
    });

    return instance;
  };
}

export function Popup(): TimelinePipe<_Picker> {
  return (instance: _Picker) => {
    instance.using(
      Setup(),
      Close(),
      LogNotifications(),
      ResolveWithPicks(),
      CloseOnPick(),
    );

    return instance;
  };
}
