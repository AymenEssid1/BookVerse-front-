import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookUpdateService {
  private bookUpdatedSource = new Subject<void>();

  bookUpdated$ = this.bookUpdatedSource.asObservable();

  emitBookUpdated(): void {
    this.bookUpdatedSource.next();
  }
}
