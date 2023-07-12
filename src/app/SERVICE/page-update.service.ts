import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageUpdateService {
  private pageUpdatedSource = new Subject<void>();

  pageUpdated$ = this.pageUpdatedSource.asObservable();

  emitPageUpdated(): void {
    this.pageUpdatedSource.next();
  }
}

