import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class paymentService {
    private orderbaseUrl = 'http://localhost:8080/orders';
    private paybaseUrl = 'http://localhost:8080/payment';

    constructor(private http: HttpClient) { }


    createOrder(): Observable<any> {
        const token: any = localStorage.getItem('jwtToken');
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
        const id = decodedToken.id;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = new HttpParams().set('id', id.toString());
        return this.http.post<any>(`${this.orderbaseUrl}/create`, null, { headers, params });//faza houni mtaa el param
    }
    checkOrder(orderId: number, token: string): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('orderid', orderId.toString()).set('token', token.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.paybaseUrl}/check`, options); // Pass the options object as the second argument
    }















}