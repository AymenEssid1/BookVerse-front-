

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private baseUrl = 'http://localhost:8080/api/v1/user';
  
    constructor(private http: HttpClient) { }

    getUsers(): Observable<any[]> {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<any[]>(`${this.baseUrl}/getAllUsers`, { headers });
      }



















}