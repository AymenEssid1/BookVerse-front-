import { Component, Input, Inject, OnInit, EventEmitter, Output, Renderer2, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cart: any },
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.cart = this.data.cart;
    console.log(this.cart);

    
  }


}