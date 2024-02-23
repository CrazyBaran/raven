import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';

import { PagedShortlistDataWithExtras } from '@app/rvns-shortlists';
import { Observable } from 'rxjs';
import { BulkAddOrganisationsToShortlistDto } from './models/bulk-add-organisations-to-shortlist.model';
import { BulkRemoveFromShortlistDto } from './models/bulk-remove-from-shortlist.model';
import { CreateShortlistDto } from './models/create-shortlist-data.model';
import { GetShortlistDto, ShortlistDto } from './models/shortlist.model';
import { UpdateShortlistDto } from './models/update-shortlist.model';

@Injectable({
  providedIn: 'root',
})
export class ShortlistsService {
  private url = '/api/shortlists';

  public constructor(private http: HttpClient) {}

  public getShortlists(
    params?: GetShortlistDto,
  ): Observable<GenericResponse<PagedShortlistDataWithExtras>> {
    return this.http.get<GenericResponse<PagedShortlistDataWithExtras>>(
      this.url,
      {
        params: {
          ...(params ?? {}),
        },
      },
    );
  }

  public getShortlist(id: string): Observable<GenericResponse<ShortlistDto>> {
    return this.http.get<GenericResponse<ShortlistDto>>(`${this.url}/${id}`);
  }

  public createShortlist(
    createShortlist: CreateShortlistDto,
  ): Observable<GenericResponse<ShortlistDto>> {
    return this.http.post<GenericResponse<ShortlistDto>>(
      this.url,
      createShortlist,
    );
  }

  public updateShortlist(
    id: string,
    changes: UpdateShortlistDto,
  ): Observable<GenericResponse<ShortlistDto>> {
    return this.http.patch<GenericResponse<ShortlistDto>>(
      `${this.url}/${id}`,
      changes,
    );
  }

  public deleteShortlist(
    shortlistId: string,
  ): Observable<GenericResponse<null>> {
    return this.http.delete<GenericResponse<null>>(
      `${this.url}/${shortlistId}`,
    );
  }

  public bulkAddOrganisationsToShortlist(
    data: BulkAddOrganisationsToShortlistDto,
  ): Observable<GenericResponse<null>> {
    return this.http.patch<GenericResponse<null>>(`${this.url}`, data);
  }

  public bulkRemoveOrganisationsFromShortlist(
    data: BulkRemoveFromShortlistDto,
  ): Observable<GenericResponse<null>> {
    return this.http.delete<GenericResponse<null>>(
      `${this.url}/${data.shortlistId}/organisations`,
      {
        body: {
          organisations: data.organisations,
        },
      },
    );
  }
}
