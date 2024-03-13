import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
// TODO: fix boundaries
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PipelinesService } from '@app/client/pipelines/data-access';
import { GenericResponse } from '@app/rvns-api';
import { OpportunityData, OpportunityTeamData } from '@app/rvns-opportunities';
import { Observable, switchMap } from 'rxjs';

export type OpportunityChanges = {
  pipelineStageId?: string;
  tagId?: string;
} & Record<string, unknown>;

export type OpportunitiesResponse = {
  items: OpportunityData[];
  total: number;
};

// todo: remove any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CreateOpportunity = any & {
  organisationId: string;
  domain: string;
  name: string;
};

@Injectable({
  providedIn: 'root',
})
export class OpportunitiesService {
  private url = '/api/opportunities';

  public constructor(
    private readonly http: HttpClient,
    private pipelineService: PipelinesService,
  ) {}

  public getOpportunities(
    params: Params,
  ): Observable<GenericResponse<OpportunitiesResponse>> {
    return this.http.get<GenericResponse<OpportunitiesResponse>>(this.url, {
      params,
    });
  }

  public getOpportunityDetails(
    id: string,
  ): Observable<GenericResponse<OpportunityData>> {
    return this.http.get<GenericResponse<OpportunityData>>(`${this.url}/${id}`);
  }

  public patchOpportunity(
    opportunityId: string,
    changes: OpportunityChanges,
  ): Observable<GenericResponse<OpportunityData>> {
    return this.http.patch<GenericResponse<OpportunityData>>(
      `${this.url}/${opportunityId}`,
      changes,
    );
  }

  public createOpportunity(
    createOpportunity: CreateOpportunity,
  ): Observable<GenericResponse<OpportunityData>> {
    return this.http.post<GenericResponse<OpportunityData>>(
      this.url,
      createOpportunity,
    );
  }

  public patchOpportunityTeam(
    opportunityId: string,
    payload: {
      owners: string[];
      members: string[];
    },
  ): Observable<GenericResponse<OpportunityTeamData>> {
    return this.http.patch<GenericResponse<OpportunityTeamData>>(
      `${this.url}/${opportunityId}/team`,
      payload,
    );
  }

  public createOpportunityTeam(
    opportunityId: string,
    payload: {
      owners: string[];
      members: string[];
    },
  ): Observable<GenericResponse<OpportunityTeamData>> {
    return this.http.post<GenericResponse<OpportunityTeamData>>(
      `${this.url}/${opportunityId}/team`,
      payload,
    );
  }

  public reopenOpportunity(
    opportunityId: string,
    duplicateAndReopen?: boolean,
    versionName?: string,
  ): Observable<GenericResponse<OpportunityData>> {
    if (duplicateAndReopen && versionName) {
      return this.patchOpportunity(opportunityId, {
        duplicateAndReopen,
        versionName,
      });
    }
    return this.getOpportunityDetails(opportunityId).pipe(
      switchMap((opportunityDetailsResponse) => {
        const previousPipelineStageId =
          opportunityDetailsResponse.data?.previousPipelineStageId;

        return this.patchOpportunity(opportunityId, {
          pipelineStageId: previousPipelineStageId,
        });
      }),
    );
  }
}
