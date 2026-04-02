import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceItem } from '../models/InvoiceItem';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceItemService {
  private apiUrl = 'https://localhost:44322/api/Item';

  constructor(private http: HttpClient) { }

  getAllItem(): Observable<InvoiceItem[]> {
    return this.http.get<InvoiceItem[]>(this.apiUrl);
  }

  addItem(data: InvoiceItem) {
    return this.http.post(this.apiUrl, data);
  }

  updateItem(id: number, data: InvoiceItem) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getItemDetails(id: number): Observable<InvoiceItem[]> {
      return this.http.get<InvoiceItem[]>(`${this.apiUrl}/${id}`);
    }

  deleteItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
