import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';
import { TagData } from '@app/rvns-tags';

import { CreateTagData } from './models/create-tag-data.model';

import { retryWithDelay } from '@app/client/shared/util-rxjs';
import { OrganisationsService } from '@app/client/tags/api-organisations';
import { Observable, map, switchMap } from 'rxjs';
import { CreateTagResponse } from './models/create-tag-response';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private url = '/api/tags';

  public constructor(
    private http: HttpClient,
    private organisationService: OrganisationsService,
  ) {}

  public getTags(params?: {
    query?: string;
    type?: string;
    organisationId?: string;
  }): Observable<GenericResponse<TagData[]>> {
    return this.http.get<GenericResponse<TagData[]>>(this.url, {
      params: {
        ...params,
      },
    });
  }

  public createTag(
    createNote: CreateTagData,
  ): Observable<GenericResponse<CreateTagResponse>> {
    if (createNote.type === 'company') {
      return this.organisationService.createOrganisation(createNote).pipe(
        switchMap((response) =>
          this.getTags({
            type: 'company',
            organisationId: response?.data?.id,
          }).pipe(
            map((getTagResponse) => {
              const tag = getTagResponse?.data?.find(
                ({ organisationId }) => organisationId === response?.data?.id,
              );

              if (!tag) throw new Error('Tag not found');

              return {
                data: {
                  ...tag,
                },
              } as GenericResponse<CreateTagResponse>;
            }),
            retryWithDelay(3, 250),
          ),
        ),
      );
    }

    return this.http.post<GenericResponse<CreateTagResponse>>(
      this.url,
      createNote,
    );
  }
}
