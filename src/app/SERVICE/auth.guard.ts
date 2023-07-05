import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const role = decodedToken.role;

      if (role === 'ADMIN') {
        // Allow access to the route
        return true;
      } else if (role === 'USER') {
        // Redirect to the front-page route
        this.router.navigate(['/front-page']);
        return false;
      }
    }

    // Redirect to the login page or handle unauthorized access
    this.router.navigate(['/login']);
    return false;
  }
}
