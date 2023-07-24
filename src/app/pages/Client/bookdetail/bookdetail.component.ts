import { BookService } from 'src/app/SERVICE/BookService';
import { Component, Input, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.scss']
})
export class BookdetailComponent {
  constructor(private snackBar: MatSnackBar ,@Inject(MAT_DIALOG_DATA) public data: { bookId: number },private bookService: BookService){}
  book:any=[];
  rating:any=[];
  selectedStar: number=5;
  review:any[];
  isButtonDisabled: boolean = false;


  ngOnInit(){

    this.bookService.getBookbyID(this.data.bookId).subscribe(
      (response) => {
        this.book = response;
        console.log(this.book);

      },
      (error) => {
        console.error('Error retrieving book:', error);
      }
    );



    this.bookService.getReview(this.data.bookId).subscribe(
      (response) => {
        this.review = response;
        console.log('Response Rating:', response.rating);
        this.selectedStar = response.rating; // Set the selectedStar based on the response.rating
        console.log('Selected Star:', this.selectedStar);
      },
      (error) => {
        if (error.status === 404) {
          // Handle 406 error here
          this.selectedStar=0;
        } else {
          console.error('Error creating order:', error);
        }
      }
    );

  }

  onStarChange() {
  console.log('Selected Star:', this.selectedStar);
}

  ratebook(rating:number){
    console.log(rating);
    this.bookService.rateBook(this.data.bookId,rating).subscribe(
      (response) => {
        this.rating = response;
        console.log(this.rating);
        this.snackBar.open('Review Added', 'Close', { duration: 2000 });
      },
      (error) => {
        console.error('Error retrieving rating:', error);
      }
    );

  }



  
}
