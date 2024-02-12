import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { map, Observable } from 'rxjs';
import { CreateOrganisation } from '../models/create-organisation.model';
import { DataWarehouseLastUpdated } from '../models/data-warehouse-last-updated';
import { Organisation } from '../models/organisation.model';

export type OrganisationsResponse = {
  items: Organisation[];
  total: number;
};

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService {
  private url = '/api/organisations';

  public constructor(private http: HttpClient) {}

  public getOrganisations(
    params?: Record<string, string | string[]>,
  ): Observable<GenericResponse<OrganisationsResponse>> {
    return this.http.get<GenericResponse<OrganisationsResponse>>(this.url, {
      params,
    });
  }

  public getOrganisation(
    id: string,
  ): Observable<GenericResponse<Organisation>> {
    return this.http.get<GenericResponse<Organisation>>(`${this.url}/${id}`);
  }

  public createOrganisation(
    create: CreateOrganisation,
  ): Observable<GenericResponse<Organisation>> {
    return this.http.post<GenericResponse<Organisation>>(this.url, create);
  }

  public createOrganisationSharepointFolder(id: string): Observable<unknown> {
    return this.http.post<unknown>(
      `/api/on-behalf-of/organisation/${id}/directory`,
      {},
    );
  }

  public getDataWarehouseLastUpdated(): Observable<
    GenericResponse<DataWarehouseLastUpdated>
  > {
    return this.http.get<GenericResponse<DataWarehouseLastUpdated>>(
      `/api/dwh/last-updated`,
    );
  }

  public checkIfDomainExists(value: string): Observable<boolean> {
    return this.getOrganisations({ take: '100', skip: '0', query: value }).pipe(
      map(
        (response) =>
          response.data?.items.some((organisation) =>
            organisation.domains
              .map((d) => d.toLowerCase())
              .includes(value.toLowerCase()),
          ) ?? false,
      ),
    );
  }

  public patchOrganisation(
    id: string,
    changes: Partial<Organisation>,
  ): Observable<GenericResponse<Organisation>> {
    return this.http.patch<GenericResponse<Organisation>>(
      `${this.url}/${id}`,
      changes,
    );
  }
}
