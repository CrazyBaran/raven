import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { map, Observable } from 'rxjs';
import { CreateOrganisation } from '../models/create-organisation.model';
import { DataWarehouseLastUpdated } from '../models/data-warehouse-last-updated';
import { OrganisationNews } from '../models/organisation-news.model';
import { Organisation } from '../models/organisation.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PagedData } from 'rvns-shared';
import { OrganisationContact } from '../models/contact.model';
import { OrganisationInteraction } from '../models/interaction.model';

import { EmployeeChartData } from '../models/employee-chart-data.model';
import { OrganisationFundingData } from '../models/organisation-funding-data.model';

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
    params?: Record<string, number | string | string[]>,
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

  public getIndustries(query?: string): Observable<GenericResponse<string[]>> {
    return this.http.get<GenericResponse<string[]>>(`/api/dwh/industries`, {
      params: {
        query: query ?? '',
      },
    });
  }

  public checkIfDomainExists(value: string): Observable<boolean> {
    return this.getOrganisations({
      take: '100',
      skip: '0',
      domain: value,
    }).pipe(
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

  public getContacts(
    id: string,
    params?: Record<string, string | number | boolean | string[] | number[]>,
  ): Observable<GenericResponse<PagedData<OrganisationContact>>> {
    return this.http.get<GenericResponse<PagedData<OrganisationContact>>>(
      `${this.url}/${id}/contacts`,
      { params },
    );
  }

  public getEmployeesChartData(
    id: string,
    params?: Record<string, string | number | boolean | string[] | number[]>,
  ): Observable<GenericResponse<PagedData<EmployeeChartData>>> {
    return this.http.get<GenericResponse<PagedData<EmployeeChartData>>>(
      `${this.url}/${id}/employees`,
      { params },
    );
  }

  public getNews(
    id: string,
    params?: Record<string, string | number | boolean | string[] | number[]>,
  ): Observable<GenericResponse<PagedData<OrganisationNews>>> {
    return this.http.get<GenericResponse<PagedData<OrganisationNews>>>(
      `${this.url}/${id}/news`,
      { params },
    );
  }

  public getFundingData(
    id: string,
    params?: Record<string, string | number | boolean | string[] | number[]>,
  ): Observable<GenericResponse<PagedData<OrganisationFundingData>>> {
    return this.http.get<GenericResponse<PagedData<OrganisationFundingData>>>(
      `${this.url}/${id}/funding-rounds`,
      { params },
    );
  }

  public getTimelineData(
    id: string,
    params?: Record<string, string | number | boolean | string[] | number[]>,
  ): Observable<GenericResponse<PagedData<OrganisationInteraction>>> {
    return this.http.get<GenericResponse<PagedData<OrganisationInteraction>>>(
      `${this.url}/${id}/interactions`,
      { params },
    );
  }
}
