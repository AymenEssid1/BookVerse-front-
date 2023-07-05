import { Component } from '@angular/core';
import axios from 'axios';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AppSideLoginComponent {
  username: string;
  password: string;

  constructor(private router: Router) {
    
  }

  login() {
    const url = 'http://localhost:8080/api/v1/auth/authenticate';
    const credentials = {
      email: this.username,
      password: this.password
    };
  
    axios.post(url, credentials)
      .then((response: any) => {
        const token = response.data.access_token;
  
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
        const role = decodedToken.role; // Extract the role from the decoded token
        localStorage.setItem('jwtToken', token);
       // console.log('JWT token stored in local storage:', token);
        // Handle the role based on your application logic
        if (role === 'ADMIN') {
          this.router.navigate(['/books']);
        } else if (role === 'USER') {
          this.router.navigate(['/front-page']);
        } else {
          // Handle error
        }
  
        
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }
}
