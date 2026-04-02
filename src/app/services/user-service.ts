import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
private apiUrl = 'https://localhost:44322/api/User';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(data: User) {
    return this.http.post(this.apiUrl, data);
  }

  updateUser(id: number, data: User) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getUserDetails(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
