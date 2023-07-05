import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  constructor(public dialog: MatDialog,private location: Location,private router: Router) {}

  userEmail: string;

  ngOnInit() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.decodeJwtToken(token).then((decodedToken: any) => {
        this.userEmail = decodedToken.sub;
        console.log('Decoded JWT token:', decodedToken);
      }).catch((error: any) => {
        console.error('Error decoding JWT token:', error);
      });
    }
  }

  decodeJwtToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      try {
        const decodedToken = JSON.parse(jsonPayload);
        resolve(decodedToken);
      } catch (error) {
        reject(error);
      }
    });
  }
  logout() {
    localStorage.removeItem('jwtToken');
    this.location.replaceState('/authentication/login');
    this.router.navigate(['/authentication/login']);
  }
}
