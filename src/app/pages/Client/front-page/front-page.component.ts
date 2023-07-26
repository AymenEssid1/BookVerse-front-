import { Component, Input, Inject, HostListener, EventEmitter, ElementRef, ViewChild  } from '@angular/core';
import { HeaderComponent } from 'src/app/layouts/full/header/header.component';
import { BookService } from 'src/app/SERVICE/BookService';
import { MatDialog } from '@angular/material/dialog';
import { BookdetailComponent } from '../bookdetail/bookdetail.component';
import { CartService } from 'src/app/SERVICE/CartService';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { paymentService } from 'src/app/SERVICE/paymentService';



@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})

export class FrontPageComponent {

  

  sidebarHidden = true;


  toggleSidebar() {
    this.sidebarHidden = !this.sidebarHidden;
  }
  

  // Carousel Slides Data
  carouselSlides = [
    {
      image: 'assets/slide1.jpg', // Replace with your image path
      title: 'Welcome to Our Book Store!',
      description: 'Explore our vast collection of books and find your next favorite read.'
    },
    {
      image: 'assets/slide2.jpg', // Replace with your image path
      title: 'New Arrivals',
      description: 'Discover the latest and most exciting books that just hit the shelves.'
    },
    // Add more slides with different images and messages as needed
  ];
 // headerComponent: HeaderComponent;
  books: any[];
  OGbooks:any[];
  bookId: number;
  query: string;
  sortedBooks: any[];
  sortingOption: string;
  isSortOrderAscending: boolean = true; // Property to track the sort order

  lol:any;

  cart:any;
  userID:number;

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;


  @ViewChild('iframe') iframe: ElementRef;
  showIframe = false;
  iframeUrl: SafeResourceUrl = '';
////////////////////////////////////////////////////
  openIframe(url: string): void {
    this.showIframe = true;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);


  }

  handlePaymentComplete(event: MessageEvent) {
    if (event.data.event_id === 'paymee.complete') {
      // Close the iframe
      this.showIframe = false;
    }
  }
///////////////////////////////////////////////////////////
  incrementSum() {
    this.headerComponent.sum += 1; // Increment the sum in the Header component by 1
  }

  resetSum() {
    this.headerComponent.sum = 0; //this resets the cart 
  }
  paymentService: paymentService;


  constructor(paymentService:paymentService,private bookService: BookService,private sanitizer: DomSanitizer,private route: ActivatedRoute,
     private dialog: MatDialog,private cartService: CartService,private snackBar: MatSnackBar ,private cookieService:CookieService,
     ) { this.paymentService = paymentService;}
  ngOnInit() {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;
        this.OGbooks=response;
        this.sortBooks('newest');
        //console.log(this.sortedBooks);
      },
      (error) => {
        console.error('Error retrieving books:', error);
        //console.log(token);
      }
    );
    
    
    //////////////////
    window.addEventListener('message', this.handlePaymentComplete.bind(this), false);

    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['search'];
      if (searchQuery) {
        // Execute the search functionality using the searchQuery
        this.query = params['search'] || ''; // Set the query property from the query parameter
      this.applySearch(); // Execute the search functionality
      }
    });

  const storedResponse = this.cookieService.get('orderResponse');
  console.log(storedResponse);
  if (storedResponse) {
    const response = JSON.parse(storedResponse);
    console.log(response);
    // Extract the necessary parameters from the response and call the checkOrder function
    const orderId = response.order.id;
    const token = response.token;
    this.checkOrder(orderId, token);
    this.cookieService.delete('orderResponse');
    console.log("hello");

  }

  }


  checkOrder(orderId:number,token:string){
   console.log("check started");
   this.paymentService.checkOrder(orderId, token).subscribe(
    (response) => {
      console.log('Order checked:', response); 
      if(response.status==="success")
      { 
        this.showAlert("successful payment",0);
        this.resetSum();
        
      }
     
    },
    (error) => {
      if (error.status === 406) {
        console.error('Payment error - Not Acceptable:', error); // Log the error to the console
        this.showAlert("failed payment",1);
      } else {
        console.error('Error checking order:', error); // Log other errors to the console
      }
    }
  );
  }
 

  addToCart(bookId: number): Promise<void> {
    const token: any = localStorage.getItem('jwtToken');
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);
    const userId = decodedToken.id;
  
    return new Promise<void>((resolve, reject) => {
      this.cartService.addItemToCart(userId, bookId).subscribe(
        (response) => {
          console.log(response);
          this.snackBar.open('Book added to cart', 'Close', { duration: 2000 }); // Display the snackbar message
          resolve(); // Resolve the promise when the API call completes
          this.incrementSum();
        },
        (error) => {
          console.log(typeof userId + typeof bookId);
          console.error(error);
          // reject(error); // Reject the promise if there's an error
        }
      );
    });
  }

 
  filter(category: string, author: string, priceRange: number, rating: number) {
  this.books = this.OGbooks.filter((book) => {
    return (category === undefined || book.category === category) &&
      (priceRange === undefined || book.price <= priceRange) &&
      (rating === undefined || book.averageReview >= rating) &&
      (author === undefined || book.author === author);
  });

  console.log(this.books);
  this.sortBooks(this.sortingOption);
}

  
  resetFilters() {
    this.books = this.OGbooks
    this.sortBooks(this.sortingOption);
    console.log(this.sortedBooks);
  }
  
  

 /* onFiltersSelected(priceRange: number) {
    this.books=this.OGbooks;
    this.books = this.books.filter(book => book.price <= priceRange);

    this.sortBooks(this.sortingOption);
  }*/

  applySearch() {
    if (this.query) {
      const searchQuery = this.query.toLowerCase();
      this.bookService.getBooks().subscribe(
        (response) => {
          this.books = response.filter((book) => {
            return (
              book.category.toLowerCase().includes(searchQuery) ||
              book.author.toLowerCase().includes(searchQuery) ||
              book.name.toLowerCase().includes(searchQuery)
            );
          });
          // Sort the filtered books based on the current sorting option
          this.sortBooks(this.sortingOption);
        },
        (error) => {
          console.error('Error retrieving books:', error);
        }
      );
    } else {
      // If the search query is empty, show all books
      this.bookService.getBooks().subscribe(
        (response) => {
          this.books = response;
          // Sort all books based on the current sorting option
          this.sortBooks(this.sortingOption);
        },
        (error) => {
          console.error('Error retrieving books:', error);
        }
      );
    }
  }


  refreshBooks(query?: string) {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;


      },
      (error) => {
        console.error('Error retrieving books:', error);
      }
    );
  }

  sortBooks(option: string) {
    this.sortingOption = option;
    switch (option) {
      case 'price':
        this.sortedBooks = this.books.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        this.sortedBooks = this.books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'review':
        this.sortedBooks = this.books.sort((a, b) => b.averageReview - a.averageReview);
        break;
      case 'highestPrice':
        this.sortedBooks = this.books.sort((a, b) => b.price - a.price);
        break;
      case 'oldest':
        this.sortedBooks = this.books.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'lowestReview':
        this.sortedBooks = this.books.sort((a, b) => a.averageReview - b.averageReview);
        break;
      default:
        this.sortedBooks = this.books;
        break;
    }
  }

  /*getStars(averageReview: number): number[] {
    const maxStars = 5;
    const roundedRating = Math.round(averageReview * 2) / 2; // Round to the nearest 0.5

    const fullStars = Math.floor(roundedRating); // Get the whole number part
    const hasHalfStar = roundedRating % 1 !== 0; // Check if there is a half star

    let stars: number[] = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(1); // Add a filled star
    }

    if (hasHalfStar) {
      stars.push(0.5); // Add a half star
    }

    const remainingStars = maxStars - stars.length; // Calculate the remaining empty stars

    for (let i = 0; i < remainingStars; i++) {
      stars.push(0); // Add an empty star
    }

    return stars;
  }
*/

  openDetails(bookId: number): void {
    this.bookId = bookId;
    const dialogRef = this.dialog.open(BookdetailComponent, {
      
      disableClose: false,
      data: { bookId: this.bookId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');

    });
  }

  
  showAlert(message: string, type:number): void {
    const alertBox = document.createElement('div');
    alertBox.innerHTML = message;
    alertBox.classList.add('custom-alert');
    let color ="hsl(224, 100%, 68%);"
    if(type===1){color="red;"}
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-alert {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: ${color}
        color: white;
        padding: 100px; /* Increase the padding */
        border-radius: 5px;
        font-size: 48px; /* Increase the font size */
        z-index: 9999;
      }
    `;
  
    document.head.appendChild(style);
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.remove();
      style.remove();
    }, 3000);
  }
  
  

}
