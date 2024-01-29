import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';

import { CreateTagData } from './models/create-tag-data.model';

import { retryWithDelay } from '@app/client/shared/util-rxjs';
import {
  CreateOrganisation,
  OrganisationsService,
} from '@app/client/tags/api-organisations';
import { Observable, map, switchMap } from 'rxjs';
import { CreateTagResponse } from './models/create-tag-response';
import { Tag } from './models/tag.model';

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
    take?: number;
  }): Observable<GenericResponse<Tag[]>> {
    return this.http.get<GenericResponse<Tag[]>>(this.url, {
      params: {
        take: 500,
        ...params,
      },
    });
  }

  public createTag(
    createTag: CreateTagData,
  ): Observable<GenericResponse<CreateTagResponse>> {
    if (createTag.type === 'company') {
      return this.organisationService
        .createOrganisation(createTag as CreateOrganisation)
        .pipe(
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

    if (createTag.type === 'investor') {
      return this.organisationService
        .createOrganisation(createTag as CreateOrganisation)
        .pipe(
          switchMap((response) =>
            this.http.post<GenericResponse<CreateTagResponse>>(this.url, {
              ...createTag,
              organisationId: response?.data?.id,
            }),
          ),
        );
    }

    return this.http.post<GenericResponse<CreateTagResponse>>(
      this.url,
      createTag,
    );
  }
}
