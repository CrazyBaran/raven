import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { TemplateWithRelationsData } from '@app/rvns-templates';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  public constructor(private http: HttpClient) {}

  public getTemplates(): Observable<
    GenericResponse<TemplateWithRelationsData[]>
  > {
    return this.http.get<GenericResponse<TemplateWithRelationsData[]>>(
      '/api/templates',
      {
        params: {
          type: 'note', //todo: refactor this static param
        },
      },
    );
  }

  public getTemplate(
    id: string,
  ): Observable<GenericResponse<TemplateWithRelationsData>> {
    return this.http.get<GenericResponse<TemplateWithRelationsData>>(
      `/api/templates/${id}`,
    );
  }
}
