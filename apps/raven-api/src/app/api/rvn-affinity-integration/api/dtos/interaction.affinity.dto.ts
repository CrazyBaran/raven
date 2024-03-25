import { AffinityPersonDto } from './person.affinity.dto';

export enum AffinityInteractionType {
  Meeting = 0,
  Call = 1,
  ChatMessage = 2,
  Email = 3,
}

export enum AffinityLoggingType {
  All = 0,
  Manual = 1,
}

export enum AffinityDirectionType {
  Sent = 0,
  Received = 1,
}

export class BaseAffinityInteractionDto {
  public id: number;
  public manual_creator_id: number;
  public persons: AffinityPersonDto[];
  public type: AffinityInteractionType;
  public logging_type: AffinityLoggingType;
  public attendees: string[];
  public date: string;
  public start_time: string;
  public end_time: string;
  public title: string;
  public notes: number[];
  public direction: AffinityDirectionType;
}

export class AffinityEmailInteractionDto extends BaseAffinityInteractionDto {
  public subject: string;
  public from: AffinityPersonDto;
  public to: AffinityPersonDto[];
  public cc: AffinityPersonDto[];
}

export class AffinityMeetingInteractionDto extends BaseAffinityInteractionDto {
  public location: string;
  public attendees: string[];
}
