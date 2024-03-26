export type OrganisationInteraction = {
  readonly name: string;
  readonly type: 'email' | 'call'
  readonly date: Date;
  readonly people: string[];
  readonly mainActor: string;
};
