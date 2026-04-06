import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceItem } from '../models/invoice-item';

@Injectable({
  providedIn: 'root',
})
export class InvoiceItemService {

  private apiUrl = 'https://localhost:44322/api/InvoiceItem';
  
    constructor(private http: HttpClient) { }
  
    getAllInvoiceItem(): Observable<InvoiceItem[]> {
      return this.http.get<InvoiceItem[]>(this.apiUrl);
    }
  
    addInvoiceItem(data: InvoiceItem[]) {
      return this.http.post(this.apiUrl, data);
    }
  
    updateInvoiceItem(id: number, data: InvoiceItem) {
      return this.http.put(`${this.apiUrl}/${id}`, data);
    }
  
    getInvoiceItemDetails(id: number): Observable<InvoiceItem[]> {
        return this.http.get<InvoiceItem[]>(`${this.apiUrl}/${id}`);
      }
  
    deleteInvoiceItem(id: number) {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
  
}
