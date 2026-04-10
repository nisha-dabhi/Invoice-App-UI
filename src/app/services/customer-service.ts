import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  
  private apiUrl = 'https://localhost:44322/api/Customer';

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  addCustomer(data: Customer) {
    return this.http.post(this.apiUrl, data);
  }

  updateCustomer(id: number, data: Customer) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  getCustomerDetails(id: number): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/${id}`);
  }

  deleteCustomer(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

