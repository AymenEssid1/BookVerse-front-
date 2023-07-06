import { Component, Input,Inject, OnInit,EventEmitter,Output } from '@angular/core';
import { BookService } from 'src/app/SERVICE/BookService';
import { EditBookComponent } from 'src/app/pages/Books/edit-book/edit-book.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { UserService } from 'src/app/SERVICE/UserService';

const emailValidator = (control: FormControl) => {
  const email = control.value;
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return { invalidEmail: true };
  }
  return null;
};

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  roles: string[] = ["ADMIN","USER"];
  user:any;
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditBookComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private pageUpdateService: PageUpdateService
  ){
    
  }

  ngOnInit(){

    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, emailValidator]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      const addedUser = {
        firstname: this.userForm.value.firstname,
        lastname: this.userForm.value.lastname,
        email: this.userForm.value.email,
        password: this.userForm.value.password
      };

      const role = this.userForm.value.role;

      this.userService.addUser(role, addedUser).subscribe(
        response => {
          // Handle successful response from the backend
          console.log('User added successfully:', response);
          this.openSnackBar('User added successfully!', 'Close');
          this.pageUpdateService.emitPageUpdated();
          this.userForm.reset();
        },
        error => {
          // Handle error response from the backend
          console.error('Error adding user:', error);
          this.openSnackBar('Failed to add user.', 'Close');
        }
      );
    } else {
      // Form is invalid, show error messages
      this.userForm.markAllAsTouched();
    }
  }




  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Position horizontally
      verticalPosition: 'top' // Position vertically
    });
  }


 

}
