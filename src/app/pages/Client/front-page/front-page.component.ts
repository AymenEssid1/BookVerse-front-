import { Component, Input, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { HeaderComponent } from 'src/app/layouts/full/header/header.component';
import { BookService } from 'src/app/SERVICE/BookService';
import { MatDialog } from '@angular/material/dialog';
import { BookdetailComponent } from '../bookdetail/bookdetail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})

export class FrontPageComponent {
  headerComponent: HeaderComponent;
  books: any[];
  OGbooks:any[];
  bookId: number;
  query: string;
  sortedBooks: any[];
  sortingOption: string;
  isSortOrderAscending: boolean = true; // Property to track the sort order

  constructor(private bookService: BookService, private dialog: MatDialog,) { }
  ngOnInit() {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;
        this.OGbooks=response;
        this.sortBooks('newest');
        //console.log(this.sortedBooks);
      },
      (error) => {
        console.error('Error retrieving books:', error);
        //console.log(token);
      }
    );

  }

 
  filter(category: string, author: string, priceRange: number, rating: number) {
  this.books = this.OGbooks.filter((book) => {
    return (category === undefined || book.category === category) &&
      (priceRange === undefined || book.price <= priceRange) &&
      (rating === undefined || book.averageReview >= rating) &&
      (author === undefined || book.author === author);
  });

  console.log(this.books);
  this.sortBooks(this.sortingOption);
}

  
  resetFilters() {
    this.books = this.OGbooks
    this.sortBooks(this.sortingOption);
  }
  
  

 /* onFiltersSelected(priceRange: number) {
    this.books=this.OGbooks;
    this.books = this.books.filter(book => book.price <= priceRange);

    this.sortBooks(this.sortingOption);
  }*/

  applySearch() {
    if (this.query) {
      const searchQuery = this.query.toLowerCase();
      this.bookService.getBooks().subscribe(
        (response) => {
          this.books = response.filter((book) => {
            return (
              book.category.toLowerCase().includes(searchQuery) ||
              book.author.toLowerCase().includes(searchQuery) ||
              book.name.toLowerCase().includes(searchQuery)
            );
          });
          // Sort the filtered books based on the current sorting option
          this.sortBooks(this.sortingOption);
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
          // Sort all books based on the current sorting option
          this.sortBooks(this.sortingOption);
        },
        (error) => {
          console.error('Error retrieving books:', error);
        }
      );
    }
  }


  refreshBooks(query?: string) {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;


      },
      (error) => {
        console.error('Error retrieving books:', error);
      }
    );
  }

  sortBooks(option: string) {
    this.sortingOption = option;
    switch (option) {
      case 'price':
        this.sortedBooks = this.books.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        this.sortedBooks = this.books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'review':
        this.sortedBooks = this.books.sort((a, b) => b.averageReview - a.averageReview);
        break;
      case 'highestPrice':
        this.sortedBooks = this.books.sort((a, b) => b.price - a.price);
        break;
      case 'oldest':
        this.sortedBooks = this.books.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'lowestReview':
        this.sortedBooks = this.books.sort((a, b) => a.averageReview - b.averageReview);
        break;
      default:
        this.sortedBooks = this.books;
        break;
    }
  }

  /*getStars(averageReview: number): number[] {
    const maxStars = 5;
    const roundedRating = Math.round(averageReview * 2) / 2; // Round to the nearest 0.5

    const fullStars = Math.floor(roundedRating); // Get the whole number part
    const hasHalfStar = roundedRating % 1 !== 0; // Check if there is a half star

    let stars: number[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(1); // Add a filled star
    }

    if (hasHalfStar) {
      stars.push(0.5); // Add a half star
    }

    const remainingStars = maxStars - stars.length; // Calculate the remaining empty stars

    for (let i = 0; i < remainingStars; i++) {
      stars.push(0); // Add an empty star
    }

    return stars;
  }
*/

  openEdit(bookId: number): void {
    this.bookId = bookId;
    const dialogRef = this.dialog.open(BookdetailComponent, {
      width: '1000px',
      height: '620px',
      disableClose: false,
      data: { bookId: this.bookId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');

    });
  }



}
