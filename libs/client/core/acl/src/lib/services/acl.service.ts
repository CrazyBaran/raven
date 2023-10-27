import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ShareData } from '@app/rvns-acl';
import { GenericResponse } from '@app/rvns-api';

@Injectable({
  providedIn: 'root',
})
export class AclService {
  public constructor(private http: HttpClient) {}

  public getSharesList(
    resourceId: string,
  ): Observable<GenericResponse<ShareData[]>> {
    return this.http.get<GenericResponse<ShareData[]>>('/api/acl', {
      params: {
        resourceId,
      },
    });
  }

  public shareResource(
    role: string,
    resourceId: string,
    actors: string[],
  ): Observable<GenericResponse<ShareData>> {
    return this.http.post<GenericResponse<ShareData>>('/api/acl', {
      role,
      resourceId,
      actors,
    });
  }

  public removeShare(
    resourceId: string,
  ): Observable<GenericResponse<ShareData>> {
    return this.http.delete<GenericResponse<ShareData>>(
      `/api/acl/${resourceId}`,
    );
  }

  public getProfileAclList(): Observable<GenericResponse<ShareData[]>> {
    return this.http.get<GenericResponse<ShareData[]>>('/api/acl/profile');
  }
}
