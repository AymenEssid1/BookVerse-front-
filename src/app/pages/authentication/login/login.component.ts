import { Component } from '@angular/core';
import axios from 'axios';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { NotificationService } from 'src/app/SERVICE/notificationService';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AppSideLoginComponent {
  username: string;
  password: string;

  constructor(private router: Router,private notificationService :NotificationService) {
    
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
      console.log(token);
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const role = decodedToken.role; // Extract the role from the decoded token
      localStorage.setItem('jwtToken', token);

      if (role === 'ADMIN') {
        this.router.navigate(['/books']);
      } else if (role === 'USER') {
        this.router.navigate(['/front-page']);
      } else {
        // Handle error
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 403) {
        this.notificationService.showError('Username or password incorrect','Error');
      } else {
        console.error('Login failed:', error);
      }
    });
}







}
