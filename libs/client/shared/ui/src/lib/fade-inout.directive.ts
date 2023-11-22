import {
  AnimationBuilder,
  AnimationMetadata,
  AnimationPlayer,
  AnimationTransitionMetadata,
  animate,
  style,
  transition,
} from '@angular/animations';
import { Directive, ElementRef } from '@angular/core';

const fadeInAnimation: AnimationMetadata[] = [
  style({ opacity: 0 }),
  animate('400ms ease-in', style({ opacity: 1 })),
];

const fadeOutAnimation: AnimationMetadata[] = [
  style({ opacity: '*' }),
  animate('400ms ease-in', style({ opacity: 0 })),
];

export const fadeIn2: AnimationMetadata[] = [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease-in', style({ opacity: 1 })),
  ]),
];

export const fadeIn = (): [AnimationTransitionMetadata] => {
  return [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('200ms ease-in', style({ opacity: 1 })),
    ]),
  ];
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[animeFadeInOut]',
  standalone: true,
})
export class FadeInOutDirective {
  private player: AnimationPlayer;

  // @Input('animeFadeInOut')
  // set show(show: boolean) {
  //   const metadata = show ? fadeInAnimation : fadeOutAnimation;
  //   this.triggerAnimation(metadata);
  // }

  public constructor(
    private builder: AnimationBuilder,
    private el: ElementRef,
  ) {
    this.triggerAnimation(fadeIn2);
  }

  private triggerAnimation(
    metadata: AnimationMetadata | AnimationMetadata[],
  ): void {
    if (this.player) {
      this.player.destroy();
    }

    const factory = this.builder.build(metadata);
    const player = factory.create(this.el.nativeElement);

    player.play();
  }
}
