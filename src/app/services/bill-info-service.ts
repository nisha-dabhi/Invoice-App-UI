import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillInfo } from '../models/bill-info';

@Injectable({
  providedIn: 'root',
})
export class BillInfoService {
  
  private apiUrl = 'https://localhost:44322/api/BillInfo';

  constructor(private http: HttpClient) { }

 
  getAllBillInfos(): Observable<BillInfo[]> {
    return this.http.get<BillInfo[]>(this.apiUrl);
  }

  addBillInfo(item: BillInfo): Observable<BillInfo> {
    return this.http.post<BillInfo>(this.apiUrl, item);
  }

  updateBillInfo(id: number, data: BillInfo): Observable<BillInfo> {
    return this.http.put<BillInfo>(`${this.apiUrl}/${id}`, data);
  }

  getBillInfoDetails(id: number): Observable<BillInfo> {
    return this.http.get<BillInfo>(`${this.apiUrl}/${id}`);
  }

  deleteBillInfo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
