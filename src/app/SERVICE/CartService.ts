import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api/v1/cart';
  userid:number=1;

  constructor(private http: HttpClient) { }

  getCartbyUserId(userId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/getCartByUser/${userId}`, { headers });
  }

  addItemToCart(userId: number, bookId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('userId', userId.toString()).set('bookId', bookId.toString());
    return this.http.post<any>(`${this.baseUrl}/addToCart`, null, { headers, params });//faza houni mtaa el param
  }
  
  deleteItem(userId:number ,bookId: number ,deleteType:number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('userId', userId.toString()).set('bookId', bookId.toString()).set('deletetype', deleteType.toString());
    return this.http.post<any>(`${this.baseUrl}/removeFromCart`, null, { headers, params });
  }
 
  private decrementSumSubject = new Subject<void>();

  decrementSum$ = this.decrementSumSubject.asObservable();

  emitDecrementSum() {
    this.decrementSumSubject.next();
  }

  private decrementSumSubject2 = new Subject<number>(); // Update the type to number

  decrementSum2$ = this.decrementSumSubject2.asObservable();

  emitDecrementSum2(quant: number) { // Update the parameter type to number
    this.decrementSumSubject2.next(quant);
  }

  private cartSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public cart$ = this.cartSubject.asObservable();

 

}