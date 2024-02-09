import { Test, TestingModule } from '@nestjs/testing';
import { DomainResolver } from './domain.resolver';

describe('DomainResolver', () => {
  let domainResolver: DomainResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainResolver],
    }).compile();

    domainResolver = module.get<DomainResolver>(DomainResolver);
  });

  it('should be defined', () => {
    expect(domainResolver).toBeDefined();
  });

  it.each([[undefined], [null], [''], [',']])(
    'should return empty array when domains is %s',
    (domains) => {
      expect(domainResolver.extractDomains(domains)).toEqual([]);
    },
  );

  it.each([
    ['domains.com,domains.com', ['domains.com']],
    [
      'domains1.com,,domains2.com,  domains2.com  ,',
      ['domains1.com', 'domains2.com'],
    ],
  ])('should return unique domains', (domains, result) => {
    expect(domainResolver.extractDomains(domains)).toEqual(result);
  });
});
