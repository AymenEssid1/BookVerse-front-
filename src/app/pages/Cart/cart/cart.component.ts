import { Component, Input, Inject, OnInit, EventEmitter, Output, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { CartService } from 'src/app/SERVICE/CartService';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any;
  
  @Output() decrementSum22 = new EventEmitter<number>(); // Update the event emitter


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cart: any },
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router,
    private pageUpdateService: PageUpdateService,

    private dialogRef: MatDialogRef<CartComponent>
  ) {}

  ngOnInit() {
    this.cart = this.data.cart;
    console.log(this.cart);
    

    
  }
  
  decrementSum2(value: number) {
    this.cartService.emitDecrementSum2(value);
  }
  decrementSum() {
    this.cartService.emitDecrementSum();
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
          resolve(); // Resolve the promise when the API call completes
        },
        (error) => {
          console.error('Error retrieving cart:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
    });
    
  }


  delete1(bookId:number): Promise<void>{
    const token: any = localStorage.getItem('jwtToken');
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const userId = decodedToken.id;
      
  
      return new Promise<void>((resolve, reject) => {
        this.cartService.deleteItem(userId,bookId,1).subscribe(
          (response) => {
           
            console.log(response);
            resolve(); // Resolve the promise when the API call completes

            this.getCart();
           this.decrementSum();
           this.snackBar.open('Removed from cart', 'Close', { duration: 2000 });
           this.pageUpdateService.emitPageUpdated();
          },
          (error) => {
           
            console.error(error);
            //reject(error); // Reject the promise if there's an error
          }
        );
      });
   }
  
   delete0(bookId:number,quant:number): Promise<void>{
    const token: any = localStorage.getItem('jwtToken');
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const userId = decodedToken.id;
      
  
      return new Promise<void>((resolve, reject) => {
        this.cartService.deleteItem(userId,bookId,0).subscribe(
          (response) => {
            
            console.log(response);
            resolve(); // Resolve the promise when the API call completes
            this.getCart();
            this.decrementSum2(quant);
            this.snackBar.open('Removed from cart', 'Close', { duration: 2000 });
            this.pageUpdateService.emitPageUpdated();
          },
          (error) => {
           
            console.error(error);
            //reject(error); // Reject the promise if there's an error
          }
        );
      });
   }

   

   goToOrder() {
    this.dialogRef.close(); 

    this.router.navigate(['/order']);
    

  }

}