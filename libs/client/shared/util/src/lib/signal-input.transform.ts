import { WritableSignal } from '@angular/core';

/**
 * NOTE: Code below is a workaround before Angular signal components.
 * source: https://itnext.io/how-to-enjoy-signal-based-input-right-now-56efecaeee98
 * This variable is used to store the signal
 * created inside `signalInputTransform` function
 * Then it is used to assign it to input property value,
 *
 * This variable should not be exported
 */
let inputSignalStore: WritableSignal<unknown>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// declare function signalInputTransform<
//   Value,
//   U extends Value | undefined = Value | undefined,
// >(initialValue?: U): (value: Value | U) => Signal<Value | U>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export function signalInputTransform<
//   Value,
//   U extends Value | undefined = Value | undefined,
// >(initialValue: U): (value: Value | U) => Signal<Value | U> {
//   const signalInput = signal<Value>(initialValue as any);
//   inputSignalStore = signalInput; // assigning internal signal to another variable
//   return ((value: Value) => {
//     signalInput.set(value);
//     return signalInput as any;
//   }) as any;
// }
//
// export function signalInput<Value>(): WritableSignal<Value> {
//   return inputSignalStore as WritableSignal<Value>;
// }
