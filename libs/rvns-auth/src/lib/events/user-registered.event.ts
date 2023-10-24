export class UserRegisteredEvent {
  public constructor(
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
