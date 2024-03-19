export class ContactDto {
  public domain: string;
  public name: string;
  public email: string;
  public positions: string[];
}

export const exposedContactData: Partial<keyof ContactDto>[] = [
  'domain',
  'name',
  'email',
  'positions',
];
