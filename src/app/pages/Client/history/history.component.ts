import { UserService } from 'src/app/SERVICE/UserService';
import { Component, Input, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { HistoryService } from 'src/app/SERVICE/HistoryService';

interface HistoryItem {
  id: number;
  orderDate: string;
  paymentStatus: string;
  items: { [key: string]: number };
}
interface Book {
 
  name: string;
  author: string;
  price: number;
 
  averageReview: number;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  history: HistoryItem[]= [];
 
  
  constructor(
    public historyService: HistoryService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
  ) {}

  ngOnInit() {
    this.historyService.getOrderHistory(this.data.id).subscribe(
      (response) => {
        this.history = response as HistoryItem[];
        // Format dates to be user-friendly
        this.formatDates();
      },
      (error) => {
        console.error('Error retrieving history:', error);
      }
    );
  }

  formatDates() {
    if (this.history && this.history.length > 0) {
      for (const order of this.history) {
        order.orderDate = this.formatDate(order.orderDate);
      }
    }
  }

  formatDate(dateString: string): string {
    // Assuming the input date format is ISO date (e.g., 2023-07-10T09:39:50)
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the format as per your requirements
  }

  parseBookString(bookString: string): Book {
    
   
    const nameMatch = bookString.match(/name='([^']*)'/);
    const authorMatch = bookString.match(/author='([^']*)'/);
    const priceMatch = bookString.match(/price=(\d+\.\d+)/);
    const averageReviewMatch = bookString.match(/averageReview=(\d+\.\d+)/);

  
    if (
     
      nameMatch &&
      authorMatch &&
      priceMatch &&
      
      averageReviewMatch
    ) {
      
      return {
        
        name: nameMatch[1],
        author: authorMatch[1],
        price: parseFloat(priceMatch[1]),
        averageReview: parseFloat(averageReviewMatch[1])
      };
    } else {
      console.error('Invalid bookString format:', bookString);
      return {} as Book;
    }
  }
  
  get paidOrders() {
    // Check if the history array is defined and then filter it to get only the orders with paymentStatus === 'PAID'
    return this.history && this.history.filter((order) => order.paymentStatus === 'PAID');
  }
  
}
