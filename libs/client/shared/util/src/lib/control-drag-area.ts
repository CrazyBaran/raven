import { WindowRef } from '@progress/kendo-angular-dialog';
import { merge } from 'rxjs';

export const controlDragArea = (windowRef: WindowRef): void => {
  const windowInstance = windowRef.window.instance;
  const windowElement = windowRef.window.location.nativeElement;

  const subscriptions = [
    merge(windowInstance.topChange).subscribe(() => {
      if (windowInstance.top < 0) {
        windowInstance.top = 0;
        windowElement.style.top = '0px';
      }
    }),

    merge(windowInstance.leftChange).subscribe(() => {
      if (windowInstance.left < 0) {
        windowInstance.left = 0;
        windowElement.style.left = '0px';
      }

      if (windowInstance.left > window.innerWidth - windowInstance.width) {
        windowInstance.left = window.innerWidth - windowInstance.width;
        windowElement.style.left = `${
          window.innerWidth - windowInstance.width
        }px`;
      }
    }),

    merge(windowInstance.dragEnd, windowInstance.resizeEnd).subscribe(() => {
      if (windowInstance.top < 0) {
        windowInstance.top = 0;
      }

      if (windowInstance.left < 0) {
        windowInstance.left = 0;
        windowElement.style.left = '0px';
      }
    }),
  ];

  windowRef.window.onDestroy(() => {
    subscriptions.forEach((subscription) => subscription.unsubscribe());
  });
};
