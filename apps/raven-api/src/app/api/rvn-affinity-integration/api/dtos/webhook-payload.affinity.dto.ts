import { AffinityFieldValueChangeDto } from './field-value-change.affinity.dto';
import { AffinityListEntryDto } from './list-entry.affinity.dto';
import { AffinityOrganizationWithCrunchbaseDto } from './organization.affinity.dto';
import { AffinityPersonWithOrganisationsDto } from './person.affinity.dto';
import { AffinityWebhookSubscriptions } from './webhook-subscriptions.affinity.dto';

export type AffinityWebhookPayloadDto =
  | AffinityWebhookPayloadOrganisationDto
  | AffinityWebhookPayloadPersonDto
  | AffinityWebhookPayloadListEntryDto
  | AffinityWebhookPayloadFieldValueDto;

class AffinityWebhookPayloadBaseDto {
  public type: string;
  public sent_at: number;
}

export class AffinityWebhookPayloadOrganisationDto extends AffinityWebhookPayloadBaseDto {
  public type:
    | AffinityWebhookSubscriptions.ORGANIZATION_UPDATED
    | AffinityWebhookSubscriptions.ORGANIZATION_CREATED;
  public body: AffinityOrganizationWithCrunchbaseDto;
}

export class AffinityWebhookPayloadPersonDto extends AffinityWebhookPayloadBaseDto {
  public type:
    | AffinityWebhookSubscriptions.PERSON_CREATED
    | AffinityWebhookSubscriptions.PERSON_UPDATED;
  public body: AffinityPersonWithOrganisationsDto;
}

export class AffinityWebhookPayloadListEntryDto extends AffinityWebhookPayloadBaseDto {
  public type:
    | AffinityWebhookSubscriptions.LIST_ENTRY_CREATED
    | AffinityWebhookSubscriptions.LIST_ENTRY_DELETED;
  public body: AffinityListEntryDto;
}

export class AffinityWebhookPayloadFieldValueDto extends AffinityWebhookPayloadBaseDto {
  public type:
    | AffinityWebhookSubscriptions.FIELD_VALUE_CREATED
    | AffinityWebhookSubscriptions.FIELD_VALUE_DELETED
    | AffinityWebhookSubscriptions.FIELD_VALUE_UPDATED;
  public body: AffinityFieldValueChangeDto;
}
