import { UserService } from 'src/app/SERVICE/UserService';
import { Component, Input, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { NotificationService } from 'src/app/SERVICE/notificationService';

const emailValidator = (control: FormControl) => {
  const email = control.value;
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return { invalidEmail: true };
  }
  return null;
};
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  
  user: any;
  userForm: FormGroup;
  roles: string[] = ["ADMIN", "USER"];
  @Output() bookUpdated: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }, //this shit injects the id from the parent componenet AKA books.compo
    private formBuilder: FormBuilder,
    private notificationService :NotificationService,
    private pageUpdateService: PageUpdateService
  ) { }

  ngOnInit() {

    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, emailValidator]],
      password: [''],
      role: ['', Validators.required]
    });

    this.userService.getUserbyID(this.data.userId).subscribe(
      (response) => {
        this.user = response;
        this.populateForm();
      },
      (error) => {
        console.error('Error retrieving book:', error);
      }
    );
  }

  populateForm() {
    this.userForm.patchValue({
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      role: this.user.role,
      // password: this.user.password
    });
  }


  onSubmit() {





    if (this.userForm.valid) {
      console.log("clicked ");
      this.updateUser();
    } else {
      // Form is invalid, display error messages
      this.markFormGroupTouched(this.userForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  updateUser() {
    if (this.userForm.valid) {
      console.log("valid");

      const updatedUser = { ...this.userForm.value }; // Copy form value to a new object

      // Check if the password field is empty
      if (updatedUser.password === "") {
        updatedUser.password = null; // Assign null instead of an empty string
      }
      console.log(updatedUser);
      const userId = this.data.userId;

      this.userService.updateUser(userId, updatedUser).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.dialogRef.close(); // Close the dialog

          this.notificationService.showSuccess( 'Close','User updated successfully');

          this.pageUpdateService.emitPageUpdated();
        },
        (error) => {
          // Handle error response
          console.error('Error creating user', error);
          if (error.status === 409) {
            // Book with the same name already exists
            this.notificationService.showError('Close','Email used already');
          }

        }
      );
    }
    console.log("called");
  }


  
}
