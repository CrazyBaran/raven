import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { Observable } from 'rxjs';
import { PipelineDefinition } from '../models/pipeline-definition.model';

@Injectable({
  providedIn: 'root',
})
export class PipelinesService {
  public constructor(private readonly http: HttpClient) {}

  public getPipelines(): Observable<GenericResponse<PipelineDefinition[]>> {
    return this.http.get<GenericResponse<PipelineDefinition[]>>(
      '/api/pipeline',
    );
  }
}
