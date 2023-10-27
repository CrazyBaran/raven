import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { PipelineDefinitionData } from '@app/rvns-pipelines';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PipelinesService {
  public constructor(private readonly http: HttpClient) {}

  public getPipelines(): Observable<GenericResponse<PipelineDefinitionData[]>> {
    return this.http.get<GenericResponse<PipelineDefinitionData[]>>(
      '/api/pipeline',
    );
  }
}
