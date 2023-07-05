import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { BookService } from 'src/app/SERVICE/BookService';
import { EditBookComponent } from 'src/app/pages/Books/edit-book/edit-book.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input,Inject, OnInit,EventEmitter,Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookUpdateService } from 'src/app/SERVICE/book-update.service';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent {
  categories: string[] = [];
  image: File;
  name: string;
  author: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  averageReview: number;
  form: FormGroup;



  constructor(
    private bookService: BookService,
    public dialogRef: MatDialogRef<EditBookComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private bookUpdateService: BookUpdateService
  ){
    
  }

  ngOnInit() {
    this.loadCategories();
    
  }
  

  closePopup(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    

    this.bookService.createBookV2(this.image, this.name, this.author, this.description, this.price, this.quantity, this.category, this.averageReview)
  .subscribe(
    (response) => {
      // Handle success response
      this.openSnackBar('Book Added', 'Close');
      this.bookUpdateService.emitBookUpdated();
      this.resetForm();
      
    },
    (error) => {
      // Handle error response
      console.error('Error creating book', error);
      if (error.status === 409) {
        // Book with the same name already exists
        this.openSnackBar('Book with the same name already exists', 'Close');
      }
      if (error.status === 500) {
        // Book with the same name already exists
        this.openSnackBar('Image required', 'Close');
      }

    }
  );

  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Position horizontally
      verticalPosition: 'top' // Position vertically
    });
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }
  
  loadCategories() {
    this.bookService.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error retrieving categories:', error);
      }
    );
  }

  resetForm() {
    this.name = '';
    this.author = '';
    this.description = '';
    this.price = 0;
    this.quantity = 0;
    
    // You may also reset other properties if needed
  }
}
