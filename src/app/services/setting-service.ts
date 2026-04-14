import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanySettings, UserSettings } from '../models/setting';

@Injectable({
  providedIn: 'root',
})
export class SettingService {

  private apiUrl = 'https://localhost:44322/api/Setting';

  constructor(private http: HttpClient) { }

  getUser(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}/user`);
  }

  updateUser(data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user`, data);
  }

  getCompany(): Observable<CompanySettings> {
    return this.http.get<CompanySettings>(`${this.apiUrl}/company`);
  }

  updateCompany(data: CompanySettings): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/company`, data);
  }
}
