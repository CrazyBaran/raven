export enum WebhookSubscriptions {
  // List
  LIST_CREATED = 'list.created',
  LIST_UPDATED = 'list.updated',
  LIST_DELETED = 'list.deleted',

  // List Entry
  LIST_ENTRY_CREATED = 'list_entry.created',
  LIST_ENTRY_DELETED = 'list_entry.deleted',

  // Note
  NOTE_CREATED = 'note.created',
  NOTE_UPDATED = 'note.updated',
  NOTE_DELETED = 'note.deleted',

  // Field
  FIELD_CREATED = 'field.created',
  FIELD_UPDATED = 'field.updated',
  FIELD_DELETED = 'field.deleted',

  // Field Value
  FIELD_VALUE_CREATED = 'field_value.created',
  FIELD_VALUE_UPDATED = 'field_value.updated',
  FIELD_VALUE_DELETED = 'field_value.deleted',

  // Person
  PERSON_CREATED = 'person.created',
  PERSON_UPDATED = 'person.updated',
  PERSON_DELETED = 'person.deleted',

  // Organization
  ORGANIZATION_CREATED = 'organization.created',
  ORGANIZATION_UPDATED = 'organization.updated',
  ORGANIZATION_DELETED = 'organization.deleted',
  ORGANIZATION_MERGED = 'organization.merged',

  // Opportunity
  OPPORTUNITY_CREATED = 'opportunity.created',
  OPPORTUNITY_UPDATED = 'opportunity.updated',
  OPPORTUNITY_DELETED = 'opportunity.deleted',

  // Entity File
  FILE_CREATED = 'file.created',
  FILE_DELETED = 'file.deleted',

  // Reminder
  REMINDER_CREATED = 'reminder.created',
  REMINDER_UPDATED = 'reminder.updated',
  REMINDER_DELETED = 'reminder.deleted',
}
