import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { OpportunityData, PagedOpportunityData } from '@app/rvns-opportunities';
import { Observable } from 'rxjs';

export type OpportunityChanges = {
  pipelineStageId?: string;
  tagId?: string;
};

@Injectable({
  providedIn: 'root',
})
export class OpportunitiesService {
  public constructor(private readonly http: HttpClient) {}

  public getOpportunities(
    take: number,
    skip: number,
  ): Observable<GenericResponse<PagedOpportunityData>> {
    return this.http.get<GenericResponse<PagedOpportunityData>>(
      '/api/opportunities',
      { params: { take, skip } },
    );
  }

  public getOpportunityDetails(
    id: string,
  ): Observable<GenericResponse<OpportunityData>> {
    return this.http.get<GenericResponse<OpportunityData>>(
      `/api/opportunities/${id}`,
    );
  }

  public patchOpportunity(
    opportunityId: string,
    changes: OpportunityChanges,
  ): Observable<GenericResponse<OpportunityData>> {
    return this.http.patch<GenericResponse<OpportunityData>>(
      `/api/opportunities/${opportunityId}`,
      changes,
    );
  }
}
