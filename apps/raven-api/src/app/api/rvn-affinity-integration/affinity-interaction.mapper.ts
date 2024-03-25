import { InteractionDto } from '@app/shared/affinity';
import { Injectable } from '@nestjs/common';
import {
  AffinityEmailInteractionDto,
  AffinityMeetingInteractionDto,
} from './api/dtos/interaction.affinity.dto';
import { AffinityPersonDto } from './api/dtos/person.affinity.dto';

@Injectable()
export class AffinityInteractionMapper {
  public constructor() {}

  public mapEmails(emails: AffinityEmailInteractionDto[]): InteractionDto[] {
    return emails.map((email) => {
      return {
        name: email.subject,
        type: 'email',
        date: new Date(email.date),
        people: [...this.mapPersons(email.to), ...this.mapPersons(email.cc)],
        mainActor: this.mapPersons([email.from])[0],
      };
    });
  }

  public mapMeetings(
    meetings: AffinityMeetingInteractionDto[],
  ): InteractionDto[] {
    return meetings.map((meeting) => {
      return {
        name: meeting.title,
        type: 'call',
        date: new Date(meeting.date),
        people: [...this.mapPersons(meeting.persons)],
        mainActor: undefined,
      };
    });
  }

  public mapPersons(persons: AffinityPersonDto[]): string[] {
    return persons.map((person) => `${person.first_name} ${person.last_name}`);
  }
}
