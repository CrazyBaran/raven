export class CompletedJobEvent<JobData, Output> {
  public constructor(
    public readonly data: JobData,
    public readonly output: Output
  ) {}
}
