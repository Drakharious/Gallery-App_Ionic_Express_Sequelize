import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  endpoint = `${API_CONFIG.BASE_URL}/users`;

  constructor(private httpClient: HttpClient) { }

  update(id: number, name: string, email: string): Observable<any> {
    return this.httpClient.put(`${this.endpoint}/${id}`, { name, email });
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
