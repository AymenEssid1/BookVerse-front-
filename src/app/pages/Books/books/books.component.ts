import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from 'src/app/SERVICE/BookService';
import { EditBookComponent } from 'src/app/pages/Books/edit-book/edit-book.component';
import { MatDialog } from '@angular/material/dialog';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { AddBookComponent } from '../add-book/add-book.component';
import { MatSort } from '@angular/material/sort';
import { Subject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';


export interface booksData {
  id: number;
  author: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
}


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  books: booksData[];
  dataSource: MatTableDataSource<booksData>;
  booky: any;
  bookId: number;
  //imageUrl: string;
  displayedColumns: string[] = ['Book', 'price', 'quantity', 'category', 'action'];
  searchQuery: string;
  searchQuerySubject: Subject<string> = new Subject<string>();


  constructor(private bookService: BookService,
    private dialog: MatDialog,
    private pageUpdateService: PageUpdateService) { }
  


  ngOnInit() {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;
        this.dataSource = new MatTableDataSource(this.books);
    this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error retrieving books:', error);
      }
    );

    // Subscribe to the bookUpdateService for updates
    this.pageUpdateService.pageUpdated$.subscribe(() => {
      this.refreshBooks();
    });

    this.searchQuerySubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.applySearch(query);
      });

      
  }


  ///////////////****delete *////////////////////////////////
  deleteBook(bookId: number) {
    this.bookService.deleteBook(bookId).subscribe(
      () => {
        this.fetchBooks();
      },
      (error) => {
        console.log('Error deleting book:', error);
      }
    );
  }

  fetchBooks() {
    this.bookService.getBooks().subscribe(
      (books) => {
        this.books = books;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }
  /////////////////////////////edit/////////////////////////////////////////////




  openEdit(bookId: number): void {
    this.bookId = bookId;
    const dialogRef = this.dialog.open(EditBookComponent, {
      width: '500px',
      height: '620px',
      disableClose: false,
      data: { bookId: this.bookId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
      
    });
  }


  openAdd(): void {

    const dialogRef = this.dialog.open(AddBookComponent, {
      width: '500px',
      height: '620px',
      disableClose: false,
      // data: { bookId: this.bookId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
      if (result === 'updated') {
        this.refreshBooks(); // Call the refreshBooks() method when the book is updated
      }
    });
  }


  refreshBooks(query?: string) {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;
        if (query) {
          this.applySearch(query);
        }
      },
      (error) => {
        console.error('Error retrieving books:', error);
      }
    );
  }





  applySearch(query: string) {
    if (query) {
      query = query.toLowerCase();
      console.log(query);
      this.bookService.getBooks().subscribe(
        (response) => {
          this.books = response.filter((book) => {
            // Filter logic goes here...
            // Filter by price
            if (query.startsWith('<')) {
              const price = parseFloat(query.substring(1).trim());
              console.log(price);
              return book.price < price;
            }

            // Filter by stock
            if (query === 'out') {
              return book.quantity === 0;
            }

            if (query === 'stock') {
              return book.quantity >= 26;
            }

            if (query === 'low') {
              return book.quantity >= 1 && book.quantity <= 25;
            }

            // No specific filter prefix, match against all fields
            return (
              book.category.toLowerCase().includes(query) ||
              book.author.toLowerCase().includes(query) ||
              book.name.toLowerCase().includes(query)
            );
          });
        },
        (error) => {
          console.error('Error retrieving books:', error);
        }
      );
    } else {
      // If the search query is empty, show all books
      this.bookService.getBooks().subscribe(
        (response) => {
          this.books = response;
        },
        (error) => {
          console.error('Error retrieving books:', error);
        }
      );
    }
  }

  // Add the following method to handle search query changes
  onSearchQueryChanged(query: string) {
    this.searchQuerySubject.next(query);
  }

}
