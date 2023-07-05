import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {
  constructor() {}

  form = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  register() {
    if (this.form.valid) {
      const url = 'http://localhost:8080/api/v1/auth/register';
      const requestData = {
        firstname: this.f.firstname.value,
        lastname: this.f.lastname.value,
        email: this.f.email.value,
        password: this.f.password.value,
      };

      axios
        .post(url, requestData)
        .then((response: any) => {
          // Registration successful, handle response as needed
          console.log('Registration successful:', response.data);
        })
        .catch((error) => {
          // Registration failed, handle error
          console.error('Registration failed:', error);
        });
    }
  }
}
