import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse, UserData } from '@app/rvns-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = '/api/users/me';

  public constructor(private http: HttpClient) {}

  public me(): Observable<GenericResponse<UserData>> {
    return this.http.get<GenericResponse<UserData>>(this.url);
  }
}
