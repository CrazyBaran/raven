import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { Observable } from 'rxjs';
import { CreateOrganisation } from '../models/create-organisation.model';
import { Organisation } from '../models/organisation.model';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService {
  private url = '/api/organisations';

  public constructor(private http: HttpClient) {}

  public getOrganisations(): Observable<GenericResponse<Organisation[]>> {
    return this.http.get<GenericResponse<Organisation[]>>(this.url);
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
}
