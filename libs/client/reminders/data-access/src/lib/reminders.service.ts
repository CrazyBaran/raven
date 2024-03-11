import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@app/rvns-api';

import { PagedData } from 'rvns-shared';
import { forkJoin, map, Observable } from 'rxjs';
import { CreateReminderDto } from './models/create-reminder.model';
import {
  GetRemindersDto,
  ReminderDto,
  ReminderStats,
} from './models/reminder.model';
import { UpdateReminderDto } from './models/update-reminder.model';

@Injectable({
  providedIn: 'root',
})
export class RemindersService {
  private url = '/api/reminders';

  public constructor(private http: HttpClient) {}

  public getReminders(
    params?: GetRemindersDto,
  ): Observable<GenericResponse<PagedData<ReminderDto>>> {
    return this.http.get<GenericResponse<PagedData<ReminderDto>>>(this.url, {
      params: {
        ...(params ?? {}),
      },
    });
  }

  public getReminder(id: string): Observable<GenericResponse<ReminderDto>> {
    return this.http.get<GenericResponse<ReminderDto>>(`${this.url}/${id}`);
  }

  public createReminder(
    createReminder: CreateReminderDto,
  ): Observable<GenericResponse<ReminderDto>> {
    return this.http.post<GenericResponse<ReminderDto>>(
      this.url,
      createReminder,
    );
  }

  public updateReminder(
    id: string,
    changes: UpdateReminderDto,
  ): Observable<GenericResponse<ReminderDto>> {
    return this.http.patch<GenericResponse<ReminderDto>>(
      `${this.url}/${id}`,
      changes,
    );
  }

  public deleteReminder(
    shortlistId: string,
  ): Observable<GenericResponse<null>> {
    return this.http.delete<GenericResponse<null>>(
      `${this.url}/${shortlistId}`,
    );
  }

  public completeReminder(ids: string[]): Observable<GenericResponse<null>> {
    return forkJoin(
      ids.map((id) =>
        this.http.patch<GenericResponse<null>>(`${this.url}/${id}`, {
          completed: true,
        }),
      ),
    ).pipe(
      map(
        () =>
          ({
            data: null,
            status: 'success',
            message: '',
            statusCode: 200,
          }) as GenericResponse<null>,
      ),
    );
  }

  public getRemindersStats(): Observable<GenericResponse<ReminderStats>> {
    return this.http.get<GenericResponse<ReminderStats>>(`${this.url}/stats`);
  }
}
