import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../models/bill';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  
  private apiUrl = 'https://localhost:44322/api/Bill';

  constructor(private http: HttpClient) { }

  getAllBill(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.apiUrl);
  }

  addBill(item: Bill): Observable<Bill> {
    return this.http.post<Bill>(`${this.apiUrl}`, item);
  }

  updateBill(id: number, data: Bill) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getBillDetails(id: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/${id}`);
  }

  deleteBill(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getBillById(id: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/${id}`);
  }


}
