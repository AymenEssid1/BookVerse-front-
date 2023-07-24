import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    private orderbaseUrl = 'http://localhost:8080/orders';
   
    constructor(private http: HttpClient) { }


    getOrderHistory(userId: number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('id', userId.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.orderbaseUrl}/OrderHistory`, options); // Pass the options object as the second argument
    }


}