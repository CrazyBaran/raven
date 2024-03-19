import { AcquisitionDto } from './acquisition.dto';
import { ActorsDto } from './actors.dto';
import { ContactDto } from './contact.dto';
import { FundingRoundDto } from './funding-round.dto';
import { FundingDto } from './funding.dto';
import { GrowthStageDto } from './growth-stage.dto';
import { HqDto } from './hq.dto';
import { IndustryDto } from './industry.dto';
import { IpoDetailsDto } from './ipo-details.dto';
import { NewsDto } from './news.dto';
import { NumberOfEmployeesSnapshotDto } from './number-of-employees-snapshot.dto';
import { UrlsDto } from './urls.dto';

export class CompanyDto {
  public dealRoomId: number;

  public domain: string;
  public name: string;
  public mcvLeadScore?: number;
  public description?: string;
  public tagline?: string;
  public foundedYear?: number;
  public numberOfEmployees?: Partial<NumberOfEmployeesSnapshotDto>[];
  public tags?: string[];
  public fundingRounds?: Partial<FundingRoundDto>[];

  public growthStage?: GrowthStageDto;

  public industry?: IndustryDto;
  public hq?: HqDto;

  public funding?: FundingDto;

  public postMoneyValuation?: number;

  public actors?: ActorsDto;

  public acquisition?: AcquisitionDto;

  public ipoDetails?: IpoDetailsDto[];

  public companySize?: string;

  public webVisits?: string;

  public topCountry?: string;
  public countryBreakdown?: { [key: string]: number }[];
  public trafficSources?: { [key: string]: number }[];
  public socialTrafficBreakdown?: { [key: string]: number }[];
  public organicSearchPercentage?: string;
  public paidSearchPercentage?: string;
  public bounceRate?: string;
  public sessionDuration?: string;
  public pagesPerVisit?: string;

  public similarWebsitesAndSimilarity?: { [key: string]: number }[];
  public websitePopularityRank?: string;
  public urls: UrlsDto;

  public numberOfTrademarks?: number;
  public numberOfPatents?: number;

  public companyEmail?: string;
  public companyPhoneNumber?: string;
  public deliveryMethod?: string;

  public specterRank?: number;

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
