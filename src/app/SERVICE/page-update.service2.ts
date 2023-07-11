import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageUpdateService2 {
  private pageUpdatedSource = new Subject<void>();

  pageUpdated$ = this.pageUpdatedSource.asObservable();

  emitPageUpdated(): void {
    this.pageUpdatedSource.next();
  }
}

//to future me I use this to update the parent component after i close the child component