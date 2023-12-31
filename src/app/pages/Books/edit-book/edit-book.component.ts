import { BookService } from 'src/app/SERVICE/BookService';
import { Component, Input, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { NotificationService } from 'src/app/SERVICE/notificationService';


@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent {
  booky: any;
  selectedFile: File;
  bookForm: FormGroup;
  categories: string[] = [];
  @Output() bookUpdated: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private bookService: BookService,
    public dialogRef: MatDialogRef<EditBookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookId: number }, //this shit injects the id from the parent componenet AKA books.compo
    private formBuilder: FormBuilder,
    private notificationService :NotificationService,
    private pageUpdateService: PageUpdateService
  ) { }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      name: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.bookService.getBookbyID(this.data.bookId).subscribe(
      (response) => {
        this.booky = response;
        this.populateForm();
        this.loadCategories();
      },
      (error) => {
        console.error('Error retrieving book:', error);
      }
    );
    console.log(this.data.bookId);
  }


  populateForm() {
    this.bookForm.patchValue({
      name: this.booky.name,
      author: this.booky.author,
      description: this.booky.description,
      price: this.booky.price,
      quantity: this.booky.quantity,
      category: this.booky.category
    });
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

 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    const bookId = this.data.bookId;

    if (this.selectedFile) {
      // Upload the selected file
      this.bookService.updateBookImage(bookId, this.selectedFile).subscribe(
        (response: any) => {
          console.log('Image upload successful', response);
          this.updateBook();
        },
        (error: any) => {
          console.error('Image upload failed', error);

        }
      );
    } else {
      // No file selected, only update book details
      this.updateBook();
    }
  }

  updateBook() {
    if (this.bookForm.valid) {
      const updatedBook = this.bookForm.value;
      const bookId = this.data.bookId;

      this.bookService.updateBook(bookId, updatedBook).subscribe(
        (response) => {
          console.log('Book updated successfully:', response);
          this.dialogRef.close();

          this.notificationService.showSuccess("close","Book Edited successfully")

          this.pageUpdateService.emitPageUpdated();
        },
        (error) => {
          // Handle error response
          console.error('Error creating book', error);
          if (error.status === 409) {
            // Book with the same name already exists
            this.notificationService.showError( 'Close','Book with the same name already exists');
          }
        
        }
      );
    }
  }


  

}
