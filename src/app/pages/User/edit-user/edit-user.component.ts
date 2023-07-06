import { UserService } from 'src/app/SERVICE/UserService';
import { Component, Input,Inject, OnInit,EventEmitter,Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';

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
  roles: string[] = ["ADMIN","USER"];
  @Output() bookUpdated: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }, //this shit injects the id from the parent componenet AKA books.compo
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private pageUpdateService: PageUpdateService
  ){}

    ngOnInit(){

      this.userForm = this.formBuilder.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, emailValidator]],
        password: ['', Validators.required],
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
        const updatedUser = this.userForm.value;
        const userId = this.data.userId;
    
        this.userService.updateUser(userId, updatedUser).subscribe(
          (response) => {
            console.log('User updated successfully:', response);
            this.dialogRef.close(); // Close the dialog
    
            this.snackBar.open('User updated successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom',
            });
    
            this.pageUpdateService.emitPageUpdated();
          },
          (error) => {
            console.error('Error updating user:', error);
            // Handle error scenario and display appropriate message if needed
          }
        );
      }
      console.log("called");
    }

}
