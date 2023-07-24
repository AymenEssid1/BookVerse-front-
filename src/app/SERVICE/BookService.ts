import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://localhost:8080/api/v1/book';

  constructor(private http: HttpClient) { }

  getImageUrl(bookId: number): string {
    return `${this.baseUrl}/image/${bookId}`;
  }

  getBooks(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/Catalogue`, { headers });
  }

  deleteBook(bookId: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/RemoveBook/${bookId}`, { headers });
  }


  updateBook(bookId: number, updatedBook: any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/updateBook/${bookId}`, updatedBook, { headers });
  }

  getBookbyID(bookId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/getbookby/${bookId}`, { headers });
  }

  getCategories(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/categories`, { headers });
  }
  getAuthors(): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/getAllAuthors`, { headers });
  }

  updateBookImage(bookId: number, file: File): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.put<any>(`${this.baseUrl}/update-image/${bookId}`, formData, { headers });
    
  }


 

// Function signature with updated parameters
createBookV2(image: File, name: string, author: string, description: string, price: number, quantity: number, category: string, averageReview: number): Observable<any> {
  const token = localStorage.getItem('jwtToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const formData = new FormData();
  formData.append('image', image);
  formData.append('name', name);
  formData.append('author', author);
  formData.append('description', description);
  formData.append('price', price.toString());
  formData.append('quantity', quantity.toString());
  formData.append('category', category);
  formData.append('averageReview', averageReview.toString());

  return this.http.post<any>(`${this.baseUrl}/addBookV2`, formData, { headers });
}





rateBook(bookId:number, rating:number): Observable<any> {
  const token: any = localStorage.getItem('jwtToken');
  const jwtHelper = new JwtHelperService();
  const decodedToken = jwtHelper.decodeToken(token);
  const id = decodedToken.id;
  
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const params = new HttpParams().set('bookId', bookId.toString()).set('userId', id.toString()).set('rating', rating.toString());
  return this.http.post<any>(`${this.baseUrl}/addRating`, null, { headers, params });//faza houni mtaa el param
}

getReview(bookId:number): Observable<any> {
  const token: any = localStorage.getItem('jwtToken');
  const jwtHelper = new JwtHelperService();
  const decodedToken = jwtHelper.decodeToken(token);
  const id = decodedToken.id;
  
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const params = new HttpParams().set('bookId', bookId.toString()).set('userId', id.toString());
  const options = { headers, params };
  return this.http.get<any>(`${this.baseUrl}/getReviewByUserAndBook`,options);//faza houni mtaa el param
}


}
