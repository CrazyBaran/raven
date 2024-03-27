export class NumberOfEmployeesSnapshotDto {
  public domain: string;
  public observationDate: Date;
  public numberOfEmployees: number;
  public dataSource: string;
}

export const exposedEmployeesData: Partial<
  keyof NumberOfEmployeesSnapshotDto
>[] = ['domain', 'observationDate', 'numberOfEmployees', 'dataSource'];
