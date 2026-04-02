import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private apiUrl = 'https://localhost:44322/api/Client';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  addClient(data: Client) {
    return this.http.post(this.apiUrl, data);
  }

  updateClient(id: number, data: Client) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  getClientDetails(id: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/${id}`);
  }

  deleteClient(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


