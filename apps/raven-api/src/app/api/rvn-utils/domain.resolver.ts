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

    domain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '');
    domain = domain.replace(/\/.*$/, '');

    return domain.trim().toLowerCase();
  }

  public isEqual(domain1: string, domain2: string): boolean {
    const cleanDomain1 = this.cleanDomain(domain1);
    const cleanDomain2 = this.cleanDomain(domain2);
    return cleanDomain1 === cleanDomain2;
  }
}
