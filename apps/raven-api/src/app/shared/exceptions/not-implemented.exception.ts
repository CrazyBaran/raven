export class NotImplementedException extends Error {
  public constructor(private readonly extra?: string) {
    super(
      `Requested piece of functionality is not implemented yet${
        extra ? `: "${extra}"` : ''
      }`,
    );
  }
}
