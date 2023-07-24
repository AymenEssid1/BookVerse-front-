import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BookService } from 'src/app/SERVICE/BookService';
import { CartService } from 'src/app/SERVICE/CartService';
import { paymentService } from 'src/app/SERVICE/paymentService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  query: string = '';
  cart: any;
  iframeUrl: SafeResourceUrl;
  

  constructor(private pageUpdateService: PageUpdateService,private router: Router, private cartService: CartService ,private paymentService: paymentService,private domSanitizer: DomSanitizer,
    private cookieService:CookieService) {

  }

  ngOnInit() {
    
   this.getCart();
   this.pageUpdateService.pageUpdated$.subscribe(() => {
    this.getCart();
  });
   
  }

  getCart(): Promise<void> {
    const token: any = localStorage.getItem('jwtToken');
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);
    const id = decodedToken.id;
    return new Promise<void>((resolve, reject) => {
      this.cartService.getCartbyUserId(id).subscribe(
        (response) => {
          this.cart = response;
          console.log(this.cart);
          resolve(); 
        },
        (error) => {
          console.error('Error retrieving cart:', error);
          reject(error); 
        }
      );
    });
    
  }

  navigateWithQuery() {
    // Navigate to the "front-page" component with the search query as a query parameter
    this.router.navigate(['/front-page'], { queryParams: { search: this.query } });
  }

  order() {
    this.paymentService.createOrder().subscribe(
      (response) => {
        console.log('Order created:', response); 
        //this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.url);
        window.location.href = response.url; // Navigate to the URL directly
        console.log(response.token +"    "+response.message);
        this.cookieService.set('orderResponse', JSON.stringify(response));
       

      },
      (error) => {
        if (error.status === 406) {
          // Handle 406 error here
          this.showAlert(error.error+" is not in stock ");
        } else {
          console.error('Error creating order:', error);
        }

      }
    );
  }
  showAlert(message: string): void {
    const alertBox = document.createElement('div');
    alertBox.innerHTML = message;
    alertBox.classList.add('custom-alert');
  
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-alert {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        color: white;
        padding: 20px;
        border-radius: 5px;
        z-index: 9999;
      }
    `;
  
    document.head.appendChild(style);
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.remove();
      style.remove();
    }, 2000);
  }
  
}
