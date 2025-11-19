import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  endpoint = `${API_CONFIG.BASE_URL}/images`;

  constructor(private httpClient: HttpClient) { }

  getAll(galleryId: number): Observable<any> {
    return this.httpClient.get(`${this.endpoint}/${galleryId}`);
  }

  create(galleryId: number, formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.endpoint}/${galleryId}`, formData);
  }

  update(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${this.endpoint}/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}
