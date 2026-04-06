import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  
  private apiUrl = 'https://localhost:44322/api/Invoice';

  constructor(private http: HttpClient) { }

  getAllInvoice(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  addInvoice(data: Invoice) {
    return this.http.post(this.apiUrl, data);
  }

  updateInvoice(id: number, data: Invoice) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getInvoiceDetails(id: number): Observable<Invoice[]> {
      return this.http.get<Invoice[]>(`${this.apiUrl}/${id}`);
    }

  deleteInvoice(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
