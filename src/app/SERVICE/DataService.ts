import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private baseUrl = 'http://localhost:8080/Staistics';

    constructor(private http: HttpClient) { }


    
    getTotalSalesByYearAndMonth(year: number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('year', year.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.baseUrl}/getTotalSalesByYearAndMonth`, options); // Pass the options object as the second argument
    }

    getMostSoldBooks(period:number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('period', period.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.baseUrl}/MostSoldBooks`, options); // Pass the options object as the second argument
    }


    getLeastSoldBooks(period:number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('period', period.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.baseUrl}/LeastSoldBooks`, options); // Pass the options object as the second argument
    }



    getBooksSoldByCategory(period:number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
      const params = new HttpParams().set('period', period.toString());
      const options = { headers, params };
        return this.http.get<any>(`${this.baseUrl}/BooksSoldByCategory`, options); // Pass the options object as the second argument
    }






}