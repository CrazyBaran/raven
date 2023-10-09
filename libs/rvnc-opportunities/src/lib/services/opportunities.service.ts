import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { OpportunityData } from '@app/rvns-opportunities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpportunitiesService {
  public constructor(private http: HttpClient) {}

  public getOpportunities(): Observable<GenericResponse<OpportunityData[]>> {
    return this.http.get<GenericResponse<OpportunityData[]>>(
      '/api/opportunities',
      { params: { take: 1000, skip: 0 } },
    );
  }
}
