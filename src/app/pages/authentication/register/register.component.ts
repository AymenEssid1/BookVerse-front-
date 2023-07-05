import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
  
})
export class AppSideRegisterComponent {
  constructor(private http: HttpClient, private router: Router) {}

  formb = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.formb.controls;
  }

  register() {
    if (this.formb.valid) {
      const url = 'http://localhost:8080/api/v1/auth/register';
      const requestData = {
        firstname: this.f.firstname.value,
        lastname: this.f.lastname.value,
        email: this.f.email.value,
        password: this.f.password.value,
      };

      this.http.post(url, requestData)
        .subscribe(
          (response: any) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/authentication/login']);
          },
          (error) => {
            console.error('Registration failed:', error);
          }
        );
    }
  }
}
