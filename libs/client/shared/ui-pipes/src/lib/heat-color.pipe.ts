import { Pipe, PipeTransform } from '@angular/core';
import { HeatMapValue } from '@app/rvns-templates';

@Pipe({
  name: 'heatColor',
  standalone: true,
})
export class HearColorPipe implements PipeTransform {
  public transform(
    heat: string,
    field: 'font' | 'background' | 'badge',
  ): string {
    switch (field) {
      case 'font':
        return this.getFontColor(heat);
      case 'background':
        return this.getBackgroundColor(heat);
      case 'badge':
        return this.getBadgeColor(heat);
      default:
        return '';
    }

    if (!heat) return '#ffffff'; // default color
    return (heat as HeatMapValue) === 'great'
      ? 'var(--informational-success)'
      : heat === 'good'
      ? 'var(--informational-success-50)'
      : 'var(--informational-warning)';
  }

  private getFontColor(heat: string): string {
    if (!heat) return '#424242'; // default color
    return (heat as HeatMapValue) === 'great'
      ? 'white'
      : heat === 'good'
      ? '#424242'
      : '#424242';
  }

  private getBackgroundColor(heat: string): string {
    if (!heat) return '#ffffff'; // default color
    return (heat as HeatMapValue) === 'great'
      ? 'var(--informational-success)'
      : heat === 'good'
      ? '#B3D6B7'
      : '#FBDC8C';
  }

  private getBadgeColor(heat: string): string {
    if (!heat) return '#ffffff'; // default color
    return (heat as HeatMapValue) === 'great'
      ? 'var(--informational-success)'
      : heat === 'good'
      ? 'var(--informational-success-50)'
      : 'var(--informational-warning)';
  }
}
