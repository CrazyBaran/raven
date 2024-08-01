import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const collapseAnimation = trigger('collapse', [
  state('enter', style({ width: AUTO_STYLE, visibility: AUTO_STYLE })),
  state(
    'void, exit',
    style({
      width: '0',
      visibility: 'hidden',
      paddingLeft: 0,
      paddingRight: 0,
    }),
  ),
  transition(':enter', [animate(250 + 'ms cubic-bezier(0.4, 0.0, 0.2, 1)')]),
  transition(
    '* => void, * => leave',
    animate(250 + 'ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
  ),
]);

export const delayedFadeInAnimation = trigger('navDelayedFadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms 100ms ease-in', style({ opacity: 1 })),
  ]),
]);
