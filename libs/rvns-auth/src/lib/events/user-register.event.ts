export class UserRegisterEvent {
  public constructor(
    public readonly azureId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly roles: string[],
  ) {}
}
