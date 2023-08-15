import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { BookService } from 'src/app/SERVICE/BookService';
import { EditBookComponent } from 'src/app/pages/Books/edit-book/edit-book.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input,Inject, OnInit,EventEmitter,Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { NotificationService } from 'src/app/SERVICE/notificationService';



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
    private notificationService :NotificationService,
    private pageUpdateService: PageUpdateService
  ){
    
  }

  ngOnInit() {
    this.loadCategories();
    
  }
  

  closePopup(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    

    this.bookService.createBookV2(this.image, this.name, this.author, this.description, this.price, this.quantity, this.category, 0)
  .subscribe(
    (response) => {
      // Handle success response
      this.notificationService.showSuccess( 'Close','Book Added');
      this.pageUpdateService.emitPageUpdated();
      this.resetForm();
      
    },
    (error) => {
      // Handle error response
      console.error('Error creating book', error);
      if (error.status === 409) {
        // Book with the same name already exists
        this.notificationService.showError( 'Close','Book with the same name already exists');
      }
      if (error.status === 500) {
        // Book with the same name already exists
        this.notificationService.showError( 'Close','Image required');
      }

    }
  );

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
