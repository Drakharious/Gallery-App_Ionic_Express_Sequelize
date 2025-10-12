import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  endpoint = 'http://localhost:8080/api/images';

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
