import { Injectable } from '@nestjs/common';

@Injectable()
export class DomainResolver {
  public extractDomains(domains: string): string[] {
    if (domains === undefined || domains === null || domains === '') {
      return [];
    }
    const splitDomains = domains.split(',');

    return this.cleanDomains(splitDomains);
  }

  public cleanDomains(domains: string[]): string[] {
    if (domains === undefined || domains === null || domains.length === 0) {
      return [];
    }
    return domains
      .map((domain) => this.cleanDomain(domain))
      .filter((domain) => domain !== null)
      .filter((domain, index, self) => self.indexOf(domain) === index);
  }
  public cleanDomain(domain: string): string | null {
    if (domain === undefined || domain === null || domain === '') {
      return null;
    }
    return domain.trim().toLowerCase();
  }
}
