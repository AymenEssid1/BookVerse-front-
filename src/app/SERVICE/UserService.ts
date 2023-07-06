

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


    deleteUser(userId: number): Observable<void> {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete<void>(`${this.baseUrl}/${userId}`, { headers });
    }



    updateUser(userId: number, updatedUser: any): Observable<any> {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put<any>(`${this.baseUrl}/updateUser/${userId}`, updatedUser, { headers });
      }
    
      getUserbyID(userId: number): Observable<any> {
        const token = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<any>(`${this.baseUrl}/getUserBy/${userId}`, { headers });
      }















}