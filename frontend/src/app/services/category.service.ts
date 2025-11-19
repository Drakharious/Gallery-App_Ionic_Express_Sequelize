import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  endpoint = `${API_CONFIG.BASE_URL}/categories`;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get(this.endpoint);
  }

  getOne(id: number): Observable<any> {
    return this.httpClient.get(`${this.endpoint}/${id}`);
  }

  create(name: string, description?: string): Observable<any> {
    return this.httpClient.post(this.endpoint, { name, description });
  }

  update(id: number, name: string, description?: string): Observable<any> {
    return this.httpClient.put(`${this.endpoint}/${id}`, { name, description });
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
