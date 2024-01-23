import { AcquisitionDto } from './acquisition.dto';
import { ActorsDto } from './actors.dto';
import { FundingRoundDto } from './funding-round.dto';
import { FundingDto } from './funding.dto';
import { GrowthStageDto } from './growth-stage.dto';
import { HqDto } from './hq.dto';
import { IndustryDto } from './industry.dto';
import { NumberOfEmployeesSnapshotDto } from './number-of-employees-snapshot.dto';

export class CompanyDto {
  public dealRoomId: number;

  public domain: string;
  public name: string;
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
}
