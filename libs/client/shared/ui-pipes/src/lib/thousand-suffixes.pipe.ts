/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

const suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

export const toThousands = (input: number, digits = 0): number | string => {
  const exp = Math.floor(Math.log(input) / Math.log(1000));
  return (input / Math.pow(1000, exp)).toFixed(digits) + suffixes[exp - 1];
};

export const transformToThousands = (input: any, digits = 0): any => {
  return Number.isNaN(input) || input < 1000
    ? input
    : toThousands(input, digits);
};

@Pipe({
  name: 'thousandSuff',
  standalone: true,
})
export class ThousandSuffixesPipe implements PipeTransform {
  public transform(input: any, digits = 0): any {
    return transformToThousands(input, digits);
  }
}
