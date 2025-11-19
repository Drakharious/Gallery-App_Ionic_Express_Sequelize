import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  
  endpoint = `${API_CONFIG.BASE_URL}/galleries`;

  constructor(private httpClient: HttpClient) { }

  getAll(page = 1, limit = 100, categoryId?: number): Observable<any> {
    let url = `${this.endpoint}?page=${page}&limit=${limit}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    return this.httpClient.get(url);
  }

  getOne(id: number): Observable<any> {
    return this.httpClient.get(`${this.endpoint}/${id}`);
  }

  create(name: string, categoryId?: number | null): Observable<any> {
    return this.httpClient.post(this.endpoint, { name, categoryId });
  }

  update(id: number, data: any): Observable<any> {
    if (data instanceof FormData) {
      return this.httpClient.put(`${this.endpoint}/${id}`, data);
    }
    return this.httpClient.put(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
