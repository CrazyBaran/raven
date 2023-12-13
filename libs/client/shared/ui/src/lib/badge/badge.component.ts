/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

export type BadgeStyle = {
  backgroundColor?: string;
  color?: string;
  borderRadius?: string;
};

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  @Input() public text?: string;

  private _color = '#000000';

  @Input() public set color(value: string) {
    this._color = value;
  }

  @Input() public _borderRadius = '4px';

  @Input() public set borderRadius(value: string) {
    this._borderRadius = value;
  }

  public get badgeStyles(): BadgeStyle {
    return {
      backgroundColor: this._backgroundColor,
      color: this._color,
      borderRadius: this._borderRadius,
    };
  }

  private _backgroundColor = '#e0e0e0';

  @Input() public set backgroundColor(value: string) {
    this._backgroundColor = value;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  @Input() public set badgeStyles(style: Partial<BadgeStyle>) {
    this._color = style.color ?? this._color;
    this._backgroundColor = style.backgroundColor ?? this._backgroundColor;
  }
}
