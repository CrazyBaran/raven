import { AcquisitionDto } from './acquisition.dto';
import { ActorsDto } from './actors.dto';
import { FundingRoundDto } from './funding-round.dto';
import { FundingDto } from './funding.dto';
import { GrowthStageDto } from './growth-stage.dto';
import { HqDto } from './hq.dto';
import { IndustryDto } from './industry.dto';
import { IpoDetailsDto } from './ipo-details.dto';
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
  public numberOfEmployees?: NumberOfEmployeesSnapshotDto[];
  public tags?: string[];
  public fundingRounds?: FundingRoundDto[];

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
}
