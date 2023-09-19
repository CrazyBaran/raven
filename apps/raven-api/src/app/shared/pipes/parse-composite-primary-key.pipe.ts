import { BadRequestException, PipeTransform } from '@nestjs/common';

interface ParseCompositePrimaryKeyPipeOptions {
  separator?: string;
  mapping?: Record<number, string>;
}

export class ParseCompositePrimaryKeyPipe
  implements PipeTransform<string, Record<string, string>>
{
  public constructor(
    private readonly options: ParseCompositePrimaryKeyPipeOptions = {},
  ) {
    if (this.options.separator === undefined) {
      this.options.separator = '-';
    }
    if (this.options.mapping === undefined) {
      this.options.mapping = {};
    }
  }

  public transform(value: string): Record<string, string> {
    if (typeof value !== 'string') {
      throw new BadRequestException(`Input value should be a string`);
    }
    const parts = value
      .split(this.options.separator)
      .filter((part) => part.trim() !== '');
    if (parts.length <= 1) {
      throw new BadRequestException('Invalid composite primary key');
    }
    return parts.reduce(
      (p, c, i) => ({ ...p, [this.options.mapping[i] ?? `${i}`]: c }),
      {},
    );
  }
}
