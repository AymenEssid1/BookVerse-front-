import { Component, Input,Inject, OnInit,EventEmitter,Output } from '@angular/core';
import { BookService } from 'src/app/SERVICE/BookService';
import { EditBookComponent } from 'src/app/pages/Books/edit-book/edit-book.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { UserService } from 'src/app/SERVICE/UserService';
import { NotificationService } from 'src/app/SERVICE/notificationService';

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
    private notificationService :NotificationService,
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
        (response) => {
          // Handle successful response from the backend
          console.log('User added successfully:', response);
          this.notificationService.showSuccess('Close','User added successfully!');
          this.pageUpdateService.emitPageUpdated();
          this.userForm.reset();
        },
        (error) => {
          // Handle error response
          console.error('Error creating user', error);
          if (error.status === 409) {
            // Book with the same name already exists
            this.notificationService.showError( 'Close','Email used already');
          }
          
        }
      );
    } else {
      // Form is invalid, show error messages
      this.userForm.markAllAsTouched();
    }
  }




  


 

}
