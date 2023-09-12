export interface GenericResponse<T> {
  statusCode: number;
  message: string | string[];
  data?: T;
  error?: string;
}
