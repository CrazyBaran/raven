import { ListEntryDto } from './list-entry.dto';
import { OrganisationWithCrunchbaseDto } from './organization.dto';
import { PersonWithOrganisationsDto } from './person.dto';
import { WebhookSubscriptions } from './webhook-subscriptions.dto';

export type WebhookPayloadDto =
  | WebhookPayloadOrganisationDto
  | WebhookPayloadPersonDto
  | WebhookPayloadListEntryDto;

class WebhookPayloadBaseDto {
  public type: string;
  public sent_at: number;
}

export class WebhookPayloadOrganisationDto extends WebhookPayloadBaseDto {
  public type:
    | WebhookSubscriptions.ORGANIZATION_UPDATED
    | WebhookSubscriptions.ORGANIZATION_CREATED;
  public body: OrganisationWithCrunchbaseDto;
}

export class WebhookPayloadPersonDto extends WebhookPayloadBaseDto {
  public type:
    | WebhookSubscriptions.PERSON_CREATED
    | WebhookSubscriptions.PERSON_UPDATED;
  public body: PersonWithOrganisationsDto;
}

export class WebhookPayloadListEntryDto extends WebhookPayloadBaseDto {
  public type: WebhookSubscriptions.LIST_ENTRY_CREATED;
  public body: ListEntryDto;
}
