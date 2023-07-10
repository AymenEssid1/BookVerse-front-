import { Component } from '@angular/core';
import { HeaderComponent } from 'src/app/layouts/full/header/header.component';
import { BookService } from 'src/app/SERVICE/BookService';
import { MatDialog } from '@angular/material/dialog';
import { BookdetailComponent } from '../bookdetail/bookdetail.component';

interface productcards {
  id: number;
  imgSrc: string;
  title: string;
  price: string;
  rprice: string;
}


@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})

export class FrontPageComponent { 
  headerComponent: HeaderComponent;
  books: any[];
  bookId: number;
  constructor(private bookService: BookService, private dialog: MatDialog,) { }
  ngOnInit() {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;
        console.log(response);
      },
      (error) => {
        console.error('Error retrieving books:', error);
        //console.log(token);
      }
    );
    
  }
  
  getStars(averageReview: number): number[] {
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
