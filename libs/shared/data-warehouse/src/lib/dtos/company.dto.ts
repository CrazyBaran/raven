import { ActorsDto } from './actors.dto';
import { ContactDto } from './contact.dto';
import { FundingRoundDto } from './funding-round.dto';
import { FundingDto } from './funding.dto';
import { HqDto } from './hq.dto';
import { IndustryDto } from './industry.dto';
import { NewsDto } from './news.dto';
import { NumberOfEmployeesSnapshotDto } from './number-of-employees-snapshot.dto';

export class CompanyDto {
  public domain: string;
  public name: string;
  public mcvLeadScore?: number;
  public description?: string;
  public numberOfEmployees?: Partial<NumberOfEmployeesSnapshotDto>[];
  public tags?: string[];
  public fundingRounds?: Partial<FundingRoundDto>[];

  public industry?: IndustryDto;
  public hq?: HqDto;

  public funding?: FundingDto;

  public actors?: ActorsDto;

  public specterLastUpdated?: Date;
  public dealRoomLastUpdated?: Date;
  public lastRefreshedUtc?: Date;

  public news?: Partial<NewsDto>[];
  public contacts?: Partial<ContactDto>[];
}

export const exposedCompanyData: Partial<keyof CompanyDto>[] = [
  'name',
  'domain',
  'description',
  'hq',
  'actors',
  'funding',
  'industry',
  'mcvLeadScore',
  'lastRefreshedUtc',
  'specterLastUpdated',
  'dealRoomLastUpdated',
  'numberOfEmployees',
  'fundingRounds',
  'news',
  'contacts',
];
