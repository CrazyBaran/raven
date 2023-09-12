import { ParseCompositePrimaryKeyPipe } from './parse-composite-primary-key.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ParseCompositePrimaryKeyPipe', () => {
  let pipe: ParseCompositePrimaryKeyPipe;

  describe('transform', () => {
    it('should return parsed composite primary key', async () => {
      // Arrange
      pipe = new ParseCompositePrimaryKeyPipe();

      // Act
      const result = pipe.transform('2-5');

      // Assert
      expect(result).toStrictEqual({ '0': '2', '1': '5' });
    });
    it('should return parsed composite primary key using custom separator', async () => {
      // Arrange
      pipe = new ParseCompositePrimaryKeyPipe({ separator: '_' });

      // Act
      const result = pipe.transform('7_23');

      // Assert
      expect(result).toStrictEqual({ '0': '7', '1': '23' });
    });
    it('should return parsed composite primary key using custom mapping', async () => {
      // Arrange
      pipe = new ParseCompositePrimaryKeyPipe({
        mapping: { 0: 'firstKey', 1: 'secondKey' },
      });

      // Act
      const result = pipe.transform('43-621');

      // Assert
      expect(result).toStrictEqual({ firstKey: '43', secondKey: '621' });
    });
    it('should throw an exception if input value is not a string', async () => {
      // Arrange
      pipe = new ParseCompositePrimaryKeyPipe();

      // Act and Assert
      expect(() => pipe.transform(null)).toThrow(
        new BadRequestException('Input value should be a string')
      );
    });
    it('should throw an exception if input value have only one part', async () => {
      // Arrange
      pipe = new ParseCompositePrimaryKeyPipe();

      // Act and Assert
      expect(() => pipe.transform('23-')).toThrow(
        new BadRequestException('Invalid composite primary key')
      );
    });
  });
});
