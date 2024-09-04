import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';

import {
  FundManagerContactData,
  FundManagerData,
} from '@app/rvns-fund-managers';
import { PagedData } from 'rvns-shared';
import { Observable } from 'rxjs';
import { CreateContactDto } from './models/create-contact.model';
import { GetManagersDto } from './models/manager.model';
import { UpdateManagerDto } from './models/update-manager.model';

@Injectable({ providedIn: 'root' })
export class ManagersService {
  private url = '/api/fund_managers';

  public constructor(private http: HttpClient) {}

  public getManagers(
    params?: GetManagersDto,
  ): Observable<GenericResponse<PagedData<FundManagerData>>> {
    return this.http.get<GenericResponse<PagedData<FundManagerData>>>(
      this.url,
      {
        params: {
          ...(params ?? {}),
        },
      },
    );
  }

  public getManager(id: string): Observable<GenericResponse<FundManagerData>> {
    return this.http.get<GenericResponse<FundManagerData>>(`${this.url}/${id}`);
  }

  public updateManager(
    id: string,
    changes: UpdateManagerDto,
  ): Observable<GenericResponse<FundManagerData>> {
    return this.http.patch<GenericResponse<FundManagerData>>(
      `${this.url}/${id}`,
      changes,
    );
  }

  public createContact(
    id: string,
    data: CreateContactDto,
  ): Observable<GenericResponse<FundManagerContactData>> {
    return this.http.post<GenericResponse<FundManagerContactData>>(
      `${this.url}/${id}/contacts`,
      data,
    );
  }

  public getContacts(
    id: string,
    params?: Record<string, string | number | boolean | string[] | number[]>,
  ): Observable<GenericResponse<PagedData<FundManagerContactData>>> {
    return this.http.get<GenericResponse<PagedData<FundManagerContactData>>>(
      `${this.url}/${id}/contacts`,
      { params },
    );
  }

  public getContact(
    id: string,
  ): Observable<GenericResponse<FundManagerContactData>> {
    return this.http.get<GenericResponse<FundManagerContactData>>(
      `${this.url}/contacts/${id}`,
    );
  }

  public updateContact(
    id: string,
    changes: Partial<CreateContactDto>,
  ): Observable<GenericResponse<FundManagerContactData>> {
    return this.http.patch<GenericResponse<FundManagerContactData>>(
      `${this.url}/contacts/${id}`,
      changes,
    );
  }

  public removeContact(id: string): Observable<GenericResponse<boolean>> {
    return this.http.delete<GenericResponse<boolean>>(
      `${this.url}/contacts/${id}`,
    );
  }
}
