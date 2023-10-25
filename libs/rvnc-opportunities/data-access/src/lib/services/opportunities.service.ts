import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { OpportunityData } from '@app/rvns-opportunities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpportunitiesService {
  public constructor(private readonly http: HttpClient) {}

  public getOpportunities(
    take: number,
    skip: number,
  ): Observable<GenericResponse<OpportunityData[]>> {
    return this.http.get<GenericResponse<OpportunityData[]>>(
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
}