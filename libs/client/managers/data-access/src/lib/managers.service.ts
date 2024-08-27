import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';

import { FundManagerData } from '@app/rvns-fund-managers';
import { PagedData } from 'rvns-shared';
import { Observable } from 'rxjs';
import { GetManagersDto } from './models/manager.model';

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
}
