import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
 
  private apiUrl = 'https://localhost:44322/api/Company';

  constructor(private http: HttpClient) { }

  getAllCompany(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }
}
