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
import { CartComponent } from 'src/app/pages/Cart/cart/cart.component';
import {  Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CartService } from 'src/app/SERVICE/CartService';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/SERVICE/UserService';
import { HistoryComponent } from 'src/app/pages/Client/history/history.component';
import { ChatComponent } from 'src/app/pages/chat/chat.component';


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
  @Input() cart: any;
  
  showFiller = false;

  constructor(private cartService :CartService,public dialog: MatDialog,private location: Location,private router: Router,
    private userService :UserService) {
    
  }

  id: number;
  role:string;
  username:string;
  user:any;
  //cart:any;
  sum:number;
  private decrementSumSubscription: Subscription;
  private decrementSum2Subscription: Subscription;



  ngOnInit() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.decodeJwtToken(token).then((decodedToken: any) => {
        this.id = decodedToken.id; 
        this.role=decodedToken.role; 
       // console.log('Decoded JWT token:', decodedToken);
        //console.log(this.id);
        this.userService.getUserbyID(this.id).subscribe(
          (response) => {
            this.username = response.firstname;
            this.user=response
           // console.log(response);
          },
          (error) => {
            console.error('Error retrieving user:', error);
          }
        );
      }).catch((error: any) => {
        console.error('Error decoding JWT token:', error);
      });
    }
    this.getCart().then(() => {
     // console.log("Sum of quantities in ngOnInit:", this.sum);
    });

    this.decrementSumSubscription = this.cartService.decrementSum$.subscribe(() => {
      this.decrementSum();
    });

    this.decrementSum2Subscription = this.cartService.decrementSum2$.subscribe((quant: number) => {
      this.decrementSum2(quant);
    });

    
    
   
  }


  


  decrementSum() {
    this.sum -= 1;
  }
  decrementSum2(quant:number){

    this.sum -= quant;
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
          //console.log(this.cart.items);
          this.sum = this.cart.items.reduce((accumulator:number, currentItem:{ id: number, book: any, quantity: number }) => {
            return accumulator + currentItem.quantity;
          }, 0);
          
          //console.log("Sum of quantities:", this.sum);
          
          resolve(); // Resolve the promise when the API call completes
        },
        (error) => {
          console.error('Error retrieving cart:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
    });
    
  }

  openCart(): void {
    this.getCart().then(() => {
      const dialogRef = this.dialog.open(CartComponent, {
        width: '500px',
        height: '620px',
        disableClose: false,
        data: { cart: this.cart },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The popup was closed');
        /* if (result === 'updated') {
          this.refreshUsers(); // Call the refreshBooks() method when the book is updated
        }*/
      });
    });
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


  openHistory(): void {
  
    const dialogRef = this.dialog.open(HistoryComponent, {
      width: '1100px',
      height: '720px',
      disableClose: false,
      data: {id: this.id},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
      
    });
  }
  
  openChat(): void {
  
    const dialogRef = this.dialog.open(ChatComponent, {
      width: '520px',
      height: '520px',
      disableClose: false,
      data: {user: this.user},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
      
    });
  }


}
