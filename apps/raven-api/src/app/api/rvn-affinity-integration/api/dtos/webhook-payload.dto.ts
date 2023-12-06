import { FieldValueChangeDto } from './field-value-change.dto';
import { ListEntryDto } from './list-entry.dto';
import { OrganizationWithCrunchbaseDto } from './organization.dto';
import { PersonWithOrganisationsDto } from './person.dto';
import { WebhookSubscriptions } from './webhook-subscriptions.dto';

export type WebhookPayloadDto =
  | WebhookPayloadOrganisationDto
  | WebhookPayloadPersonDto
  | WebhookPayloadListEntryDto
  | WebhookPayloadFieldValueDto;

class WebhookPayloadBaseDto {
  public type: string;
  public sent_at: number;
}

export class WebhookPayloadOrganisationDto extends WebhookPayloadBaseDto {
  public type:
    | WebhookSubscriptions.ORGANIZATION_UPDATED
    | WebhookSubscriptions.ORGANIZATION_CREATED;
  public body: OrganizationWithCrunchbaseDto;
}

export class WebhookPayloadPersonDto extends WebhookPayloadBaseDto {
  public type:
    | WebhookSubscriptions.PERSON_CREATED
    | WebhookSubscriptions.PERSON_UPDATED;
  public body: PersonWithOrganisationsDto;
}

export class WebhookPayloadListEntryDto extends WebhookPayloadBaseDto {
  public type:
    | WebhookSubscriptions.LIST_ENTRY_CREATED
    | WebhookSubscriptions.LIST_ENTRY_DELETED;
  public body: ListEntryDto;
}

export class WebhookPayloadFieldValueDto extends WebhookPayloadBaseDto {
  public type:
    | WebhookSubscriptions.FIELD_VALUE_CREATED
    | WebhookSubscriptions.FIELD_VALUE_DELETED
    | WebhookSubscriptions.FIELD_VALUE_UPDATED;
  public body: FieldValueChangeDto;
}
