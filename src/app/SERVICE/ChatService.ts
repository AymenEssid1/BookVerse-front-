import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private baseUrl = 'http://localhost:8080/api/chat';

    constructor(private http: HttpClient) { }


    
    getChatMessages(chatid: number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('chatId', chatid.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.baseUrl}/messages`, options); // Pass the options object as the second argument
    }

    getChatByBoth(id1: number,id2:number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('id1', id1.toString()).set('id2', id2.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.baseUrl}/getByBoth`, options); // Pass the options object as the second argument
    }

    getAdminChat(id: number): Observable<any> {
        const jwttoken: any = localStorage.getItem('jwtToken');

        const headers = new HttpHeaders().set('Authorization', `Bearer ${jwttoken}`);
        const params = new HttpParams().set('id', id.toString());
        const options = { headers, params };
        return this.http.get<any>(`${this.baseUrl}/adminChat`, options); // Pass the options object as the second argument
    }

    addChat(user2id:number): Observable<any> {
        const token: any = localStorage.getItem('jwtToken');
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
        const id = decodedToken.id;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = new HttpParams().set('id1', id.toString()).set('id2',user2id.toString());
        
        return this.http.post<any>(`${this.baseUrl}/add`, null, { headers, params });//faza houni mtaa el param
    }

    addMessage(chatid:number,content:string): Observable<any> {
        const token: any = localStorage.getItem('jwtToken');
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
        const id = decodedToken.id;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = new HttpParams().set('senderId', id.toString()).set('chatId',chatid.toString()).set('content',content);
        
        return this.http.post<any>(`${this.baseUrl}/addMessage`, null, { headers, params });//faza houni mtaa el param
    }



}