import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  
  endpoint = 'http://localhost:8080/api/galleries';

  constructor(private httpClient: HttpClient) { }

  getAll(page = 1, limit = 10): Observable<any> {
    return this.httpClient.get(`${this.endpoint}?page=${page}&limit=${limit}`);
  }

  getOne(id: number): Observable<any> {
    return this.httpClient.get(`${this.endpoint}/${id}`);
  }

  create(name: string): Observable<any> {
    return this.httpClient.post(this.endpoint, { name });
  }

  update(id: number, name: string): Observable<any> {
    return this.httpClient.put(`${this.endpoint}/${id}`, { name });
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
