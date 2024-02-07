import { ParseGetOrganisationsOptionsPipe } from './parse-get-organisations-options.pipe';

describe('ParseGetOrganisationsOptionsPipe', () => {
  it('should be defined', () => {
    expect(new ParseGetOrganisationsOptionsPipe()).toBeDefined();
  });

  it('should return default if no values', async () => {
    const pipe = new ParseGetOrganisationsOptionsPipe();
    const result = await pipe.transform(null, null);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(15);
    expect(result.direction).toBe('ASC');
    expect(result.orderBy).toBe('name');
    expect(result.primaryDataSource).toBe('raven');
    expect(result.query).toBe(undefined);
    expect(result.member).toBe(undefined);
    expect(result.round).toBe(undefined);
  });

  it.each([
    ['skip', '10'],
    ['take', '100'],
    ['dir', 'desc'],
    ['field', 'id'],
  ])(
    'should return default if partial values - %i',
    async (key: string, value: string) => {
      const pipe = new ParseGetOrganisationsOptionsPipe();
      const input = {};
      input[key] = value;
      const result = await pipe.transform(input, null);
      if (key != 'skip') expect(result.skip).toBe(0);
      else expect(result.skip).toBe(+value);
      if (key != 'take') expect(result.take).toBe(15);
      else expect(result.take).toBe(+value);
      if (key != 'dir') expect(result.direction).toBe('ASC');
      else expect(result.direction).toBe(value.toUpperCase() as 'ASC' | 'DESC');
      if (key != 'field') expect(result.orderBy).toBe('name');
      else expect(result.orderBy).toBe(value);
    },
  );

  it('should properly transform', async () => {
    const pipe = new ParseGetOrganisationsOptionsPipe();
    const values = {
      skip: '0',
      take: '100',
      dir: 'desc',
      field: 'id',
      query: 'test query',
      member: 'test member',
      round: 'test round',
    } as Record<string, string>;
    const result = await pipe.transform(values, null);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(100);
    expect(result.direction).toBe('DESC');
    expect(result.orderBy).toBe('id');
    expect(result.query).toBe('test query');
    expect(result.member).toBe('test member');
    expect(result.round).toBe('test round');
  });
});
